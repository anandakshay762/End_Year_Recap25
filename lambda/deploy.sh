#!/usr/bin/env bash
# Deploy the loop-launch-orchestrator Lambda + Function URL.
#
# Account 072528252688 us-east-1 (topmate-prod, where you have admin SSO).
# Cross-account: invokes the render Lambda + reads the public S3 bucket in
# account 891376915130. We don't need cross-account S3 IAM because rendered
# files are public — orchestrator does anonymous HTTPS HEAD checks.
#
# Required env (export before running):
#   AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_SESSION_TOKEN  (072528252688 admin)
#   REMOTION_TOKEN                                               (header value)

set -euo pipefail

cd "$(dirname "$0")"

REGION="us-east-1"
FUNCTION_NAME="loop-launch-orchestrator"
ROLE_NAME="loop-launch-orchestrator-role"
DEPLOY_BUCKET="topmate-lambda-deployments"     # 072528252688-owned, used for the zip staging
# Single-account: the render Lambda + render bucket both live in 072528252688.
RENDER_BUCKET="remotionlambda-useast1-unuossiqe1"
RENDER_FUNCTION="arn:aws:lambda:us-east-1:072528252688:function:remotion-render-4-0-340-mem4096mb-disk10240mb-120sec"
SERVE_URL="https://remotionlambda-useast1-unuossiqe1.s3.us-east-1.amazonaws.com/sites/topmate-loop-launch-renderer/index.html"

: "${AWS_ACCESS_KEY_ID:?set 072528252688 admin keys before running}"
: "${AWS_SECRET_ACCESS_KEY:?}"
: "${REMOTION_TOKEN:?set REMOTION_TOKEN}"
: "${PROFILE_STATS_API_KEY:?set PROFILE_STATS_API_KEY (data.analytics.topmate.io x-internal-key)}"
BACKEND_URL="${BACKEND_URL:-https://api.galactus.run}"
export AWS_DEFAULT_REGION="$REGION"

ACCOUNT_ID="$(aws sts get-caller-identity --query Account --output text)"
if [ "$ACCOUNT_ID" != "072528252688" ]; then
  echo "[deploy] expected account 072528252688, got $ACCOUNT_ID — aborting." >&2
  exit 1
fi
echo "[deploy] account=$ACCOUNT_ID  region=$REGION  function=$FUNCTION_NAME"

# ---------- pick / create deploy bucket ----------
if ! aws s3api head-bucket --bucket "$DEPLOY_BUCKET" 2>/dev/null; then
  echo "[deploy] $DEPLOY_BUCKET not in this account, falling back to a per-account name"
  DEPLOY_BUCKET="topmate-lambda-deploys-${ACCOUNT_ID}"
  if ! aws s3api head-bucket --bucket "$DEPLOY_BUCKET" 2>/dev/null; then
    echo "[deploy] creating $DEPLOY_BUCKET ..."
    aws s3api create-bucket --bucket "$DEPLOY_BUCKET" --region "$REGION" >/dev/null
  fi
fi

# ---------- build ----------
echo "[deploy] installing prod deps..."
rm -rf node_modules package-lock.json
npm install --omit=dev --silent

echo "[deploy] zipping..."
rm -f function.zip
zip -qr function.zip index.mjs films.config.mjs package.json node_modules
ZIP_SIZE=$(stat -f %z function.zip 2>/dev/null || stat -c %s function.zip)
echo "[deploy] zip size: $((ZIP_SIZE/1024/1024)) MB"

S3_KEY="lambda-deploys/${FUNCTION_NAME}/$(date +%s).zip"
echo "[deploy] uploading zip to s3://$DEPLOY_BUCKET/$S3_KEY ..."
aws s3 cp function.zip "s3://$DEPLOY_BUCKET/$S3_KEY" --no-progress >/dev/null

# ---------- IAM role (idempotent) ----------
ROLE_ARN="arn:aws:iam::${ACCOUNT_ID}:role/${ROLE_NAME}"
TRUST='{"Version":"2012-10-17","Statement":[{"Effect":"Allow","Principal":{"Service":"lambda.amazonaws.com"},"Action":"sts:AssumeRole"}]}'

if ! aws iam get-role --role-name "$ROLE_NAME" >/dev/null 2>&1; then
  echo "[deploy] creating IAM role $ROLE_NAME ..."
  aws iam create-role --role-name "$ROLE_NAME" --assume-role-policy-document "$TRUST" >/dev/null
  aws iam attach-role-policy --role-name "$ROLE_NAME" \
    --policy-arn arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole
  echo "[deploy] waiting for IAM propagation..."
  sleep 12
fi

# Always (re-)apply inline perms — cheap and ensures drift is corrected.
# - InvokeRenderLambda: needed to call renderMediaOnLambda
# - WriteCacheKey: copy completed render to <film.outDir>/<username>.mp4 so subsequent
#   /render hits the cache instead of re-rendering. PutObjectAcl is required because
#   the CopyObject in index.mjs sets ACL=public-read. Each per-film outDir gets its
#   own resource entry — add a new one when registering a new film.
aws iam put-role-policy --role-name "$ROLE_NAME" --policy-name orchestrator-perms \
  --policy-document "{
    \"Version\":\"2012-10-17\",
    \"Statement\":[
      {\"Sid\":\"InvokeRenderLambda\",\"Effect\":\"Allow\",\"Action\":[\"lambda:InvokeFunction\"],\"Resource\":\"$RENDER_FUNCTION\"},
      {\"Sid\":\"WriteCacheKeyLaunchFilms\",\"Effect\":\"Allow\",\"Action\":[\"s3:PutObject\",\"s3:PutObjectAcl\",\"s3:GetObject\"],\"Resource\":\"arn:aws:s3:::$RENDER_BUCKET/launch-films/*\"},
      {\"Sid\":\"WriteCacheKeyTestimonialReels\",\"Effect\":\"Allow\",\"Action\":[\"s3:PutObject\",\"s3:PutObjectAcl\",\"s3:GetObject\"],\"Resource\":\"arn:aws:s3:::$RENDER_BUCKET/testimonial-reels/*\"},
      {\"Sid\":\"WriteCacheKeyAprilGoogleSearchV2\",\"Effect\":\"Allow\",\"Action\":[\"s3:PutObject\",\"s3:PutObjectAcl\",\"s3:GetObject\"],\"Resource\":\"arn:aws:s3:::$RENDER_BUCKET/april-google-search-v2/*\"},
      {\"Sid\":\"ReadRenderOutputs\",\"Effect\":\"Allow\",\"Action\":[\"s3:GetObject\"],\"Resource\":\"arn:aws:s3:::$RENDER_BUCKET/renders/*\"}
    ]
  }" >/dev/null

# ---------- Lambda function (create or update via S3) ----------
ENV_VARS="Variables={LAMBDA_FUNCTION=$RENDER_FUNCTION,LAMBDA_REGION=$REGION,LAMBDA_SERVE_URL=$SERVE_URL,LAMBDA_BUCKET=$RENDER_BUCKET,BACKEND_URL=$BACKEND_URL,REMOTION_TOKEN=$REMOTION_TOKEN,PROFILE_STATS_API_KEY=$PROFILE_STATS_API_KEY}"

if aws lambda get-function --function-name "$FUNCTION_NAME" >/dev/null 2>&1; then
  echo "[deploy] updating function code..."
  aws lambda update-function-code \
    --function-name "$FUNCTION_NAME" \
    --s3-bucket "$DEPLOY_BUCKET" --s3-key "$S3_KEY" \
    --no-cli-pager >/dev/null
  aws lambda wait function-updated --function-name "$FUNCTION_NAME"
  aws lambda update-function-configuration \
    --function-name "$FUNCTION_NAME" \
    --environment "$ENV_VARS" \
    --no-cli-pager >/dev/null
else
  echo "[deploy] creating function..."
  aws lambda create-function \
    --function-name "$FUNCTION_NAME" \
    --runtime nodejs20.x \
    --role "$ROLE_ARN" \
    --handler index.handler \
    --code "S3Bucket=$DEPLOY_BUCKET,S3Key=$S3_KEY" \
    --timeout 30 --memory-size 512 \
    --environment "$ENV_VARS" \
    --no-cli-pager >/dev/null
  aws lambda wait function-active --function-name "$FUNCTION_NAME"
fi

# ---------- Function URL (create if missing) ----------
URL=$(aws lambda get-function-url-config --function-name "$FUNCTION_NAME" \
  --query FunctionUrl --output text 2>/dev/null || echo "")

if [ -z "$URL" ] || [ "$URL" = "None" ]; then
  echo "[deploy] creating function URL..."
  URL=$(aws lambda create-function-url-config \
    --function-name "$FUNCTION_NAME" \
    --auth-type NONE \
    --cors '{"AllowOrigins":["*"],"AllowMethods":["GET","POST"],"AllowHeaders":["content-type"],"MaxAge":3600}' \
    --query FunctionUrl --output text)
  aws lambda add-permission \
    --function-name "$FUNCTION_NAME" \
    --statement-id FunctionURLAllowPublicAccess \
    --action lambda:InvokeFunctionUrl \
    --principal '*' \
    --function-url-auth-type NONE >/dev/null || true
fi

URL="${URL%/}"
echo
echo "==================================================="
echo "  Function URL: $URL"
echo "==================================================="
echo
echo "Smoke test:"
echo "  curl -sS $URL/health"
echo
echo "Set on Vercel + .env.production:"
echo "  NEXT_PUBLIC_LOOP_RENDER_API=$URL"
echo
echo "Cross-account step (run with 891376915130 admin/remotion-user creds):"
echo "  aws lambda add-permission \\"
echo "    --function-name remotion-render-4-0-340-mem2048mb-disk2048mb-120sec \\"
echo "    --region us-east-1 \\"
echo "    --statement-id orchestrator-${ACCOUNT_ID} \\"
echo "    --action lambda:InvokeFunction \\"
echo "    --principal arn:aws:iam::${ACCOUNT_ID}:role/${ROLE_NAME}"
