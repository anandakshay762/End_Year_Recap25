#!/bin/bash

# Export key frames from Remotion for design self-evaluation
# This script exports the start frame of each scene for visual review

set -e

echo "🎬 Exporting key frames for design review..."
echo ""

# Create output directory
mkdir -p design-review

# Define frames to export (start of each scene)
declare -A frames=(
  ["Scene0_Intro"]=0
  ["Scene1_Journey"]=291
  ["Scene2_Reach"]=582
  ["Scene3_Peak"]=873
  ["Scene4_Signature"]=1164
  ["Scene5_Voices"]=1455
  ["Scene6_Summit"]=1746
  ["Scene7_Stars"]=2037
  ["Scene8_Universe"]=2328
  ["Scene9_Outro"]=2619
)

# Props for rendering
PROPS='{"name":"Sarah","firstBookingDate":"January 15, 2025","totalBookings":"247","city1":"Mumbai","city2":"Tokyo","mostBookedMonth":"August","mostPopularService":"1-on-1 Career Coaching","testimonial":"Working with Sarah completely transformed my career path.","topPercentage":"5","rating":"4.9"}'

# Export each frame
for scene in "${!frames[@]}"; do
  frame=${frames[$scene]}
  output="design-review/${scene}.png"

  echo "📸 Exporting $scene (frame $frame)..."

  npx remotion still final \
    --props="$PROPS" \
    --frame=$frame \
    --output="$output" \
    --quiet 2>&1 | grep -v "Version mismatch" || true

  if [ -f "$output" ]; then
    echo "   ✓ Saved: $output"
  else
    echo "   ✗ Failed to export $scene"
  fi

  echo ""
done

echo "✅ Frame export complete!"
echo "📁 Review files in: design-review/"
echo ""
echo "Self-evaluation checklist:"
echo "  □ Are stats the primary visual focus?"
echo "  □ Is the story flow clear and connected?"
echo "  □ Does each scene feel distinct and memorable?"
echo "  □ Are animations smooth and purposeful?"
echo "  □ Is typography hierarchy correct (numbers > context > labels)?"
