import React from "react";
import {
  AbsoluteFill,
  Img,
  Video,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { TestimonialCard, type Testimonial } from "./TestimonialCard";
import { TestimonialReelProps } from "./types";

const DEFAULT_TESTIMONIALS_TEXT = [
  "KlickPin completely transformed our online presence. Traffic doubled in 3 months and our conversion rate has never been better. Truly grateful for this team!",
  "The SEO strategy they built for us was phenomenal. We moved from page 5 to page 1 for every target keyword. The ROI has been incredible — worth every penny.",
  "We needed a complete digital overhaul and they delivered beyond expectations. The new site is stunning, and SEM campaigns generate consistent quality leads.",
];

const createData = (names: string[], testimonials: string[]): Testimonial[] =>
  Array.from({ length: 3 }, (_, i) => ({
    name: names[i] || `User ${i + 1}`,
    role: "",
    avatarUrl: "",
    rating: 5,
    text: testimonials[i] || DEFAULT_TESTIMONIALS_TEXT[i],
  }));

// ─────────────────────────────────────────────────────────────────────────────
// LAYOUT CONSTANTS  (1920 × 1080 landscape) - 18 SECONDS TOTAL
// ─────────────────────────────────────────────────────────────────────────────

const INTRO_DURATION = 60;
const FRAMES_PER_CARD = 120;
const OUTRO_DURATION = 60;

/** Horizontal inset for cards on each side. */
const CARD_PADDING_X = 320;

/** How far a card travels to enter/exit (px). */
const SCROLL_OFFSET = 250;

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────
export type MainProps = TestimonialReelProps;

const SPRING_CFG = { stiffness: 100, damping: 15 } as const;

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPOSITION
// ─────────────────────────────────────────────────────────────────────────────
export const Main: React.FC<MainProps> = ({
  profilePic,
  topmateLink,
  creatorName,
  name1 = "",
  name2 = "",
  name3 = "",
  testimonial1 = "",
  testimonial2 = "",
  testimonial3 = "",
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const DATA = createData(
    [name1, name2, name3],
    [testimonial1, testimonial2, testimonial3],
  );

  const adjustedFrame = Math.max(0, frame - INTRO_DURATION);
  const showIntro = frame < INTRO_DURATION;
  const outroStartFrame = durationInFrames - OUTRO_DURATION;
  const showOutro = frame >= outroStartFrame;

  const activeIndex = Math.min(
    Math.floor(adjustedFrame / FRAMES_PER_CARD),
    DATA.length - 1
  );
  const frameInSegment = adjustedFrame - activeIndex * FRAMES_PER_CARD;

  // Spring drives the enter/exit within each segment (resets to 0 each new card)
  const positionSpring = spring({ frame: frameInSegment, fps, config: SPRING_CFG });

  // Title entrance
  const titleEntrance = spring({ frame: adjustedFrame, fps, config: { stiffness: 80, damping: 18 } });
  const titleX = interpolate(titleEntrance, [0, 1], [-80, 0]);
  const titleOpacity = titleEntrance;

  // Intro animations
  const introSpring = spring({ frame, fps, config: { stiffness: 60, damping: 20 } });
  const introScale = interpolate(introSpring, [0, 1], [0.8, 1]);
  const introOpacity = interpolate(introSpring, [0, 1], [0, 1]);
  const introFadeOut =
    frame > INTRO_DURATION - 20
      ? interpolate(frame, [INTRO_DURATION - 20, INTRO_DURATION], [1, 0])
      : 1;

  // Outro animations
  const outroFrame = frame - outroStartFrame;
  const outroSpring = spring({ frame: outroFrame, fps, config: { stiffness: 60, damping: 20 } });
  const outroScale = interpolate(outroSpring, [0, 1], [0.8, 1]);
  const outroOpacity = interpolate(outroSpring, [0, 1], [0, 1]);

  return (
    <AbsoluteFill style={{ fontFamily: "sans-serif", overflow: "hidden" }}>

      {/* ── 1. Background video — zIndex 0 ───────────────────────────────── */}
      <AbsoluteFill style={{ zIndex: 0 }}>
        <Video
          src={staticFile("testimonial/bg.mp4")}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            filter: "brightness(0.85) contrast(1.05)",
          }}
        />
      </AbsoluteFill>


      {/* ── 3. Intro slide — zIndex 20 ───────────────────────────────────── */}
      {showIntro && (
        <AbsoluteFill
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            opacity: introOpacity * introFadeOut,
            zIndex: 20,
          }}
        >
          <div
            style={{
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              transform: `scale(${introScale})`,
            }}
          >
            {profilePic && profilePic.trim() !== "" ? (
              <Img
                src={profilePic}
                alt="Profile"
                style={{
                  width: 240,
                  height: 240,
                  objectFit: "contain",
                  border: "8px solid rgba(124, 58, 237, 0.8)",
                  boxShadow:
                    "0 8px 32px rgba(124, 58, 237, 0.4), 0 4px 16px rgba(0,0,0,0.5)",
                  backgroundColor: "#ffffff",
                  borderRadius: 9999,
                  marginBottom: 40,
                }}
              />
            ) : (
              <div
                style={{
                  width: 240,
                  height: 240,
                  background: "linear-gradient(135deg, #7C3AED 0%, #9333EA 100%)",
                  border: "8px solid rgba(124, 58, 237, 0.8)",
                  boxShadow:
                    "0 8px 32px rgba(124, 58, 237, 0.4), 0 4px 16px rgba(0,0,0,0.5)",
                  borderRadius: 9999,
                  marginBottom: 40,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <svg
                  width="120"
                  height="120"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </div>
            )}

            <h2
              style={{
                fontWeight: 900,
                lineHeight: 1,
                fontSize: 96,
                color: "#F9FAFB",
                textShadow: "0 4px 24px rgba(0,0,0,0.45)",
                fontFamily: "'SF Pro Display', sans-serif",
                letterSpacing: "0.05em",
                margin: 0,
              }}
            >
              {creatorName ? `${creatorName}'s testimonials` : "My testimonials"}
              {!creatorName && (
                <>
                  {" at "}
                  <span
                    style={{
                      background: "linear-gradient(90deg, #FACC15, #FDE68A)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    topmate
                  </span>
                </>
              )}
            </h2>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 12,
                marginTop: 32,
              }}
            >
              <div style={{ width: 64, height: 4, borderRadius: 9999, backgroundColor: "#A855F7" }} />
              <div style={{ width: 32, height: 4, borderRadius: 9999, backgroundColor: "rgba(168, 85, 247, 0.5)" }} />
              <div style={{ width: 16, height: 4, borderRadius: 9999, backgroundColor: "rgba(168, 85, 247, 0.25)" }} />
            </div>
          </div>
        </AbsoluteFill>
      )}

      {/* ── 4. Top-left title — zIndex 10 ────────────────────────────────── */}
      {!showIntro && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            display: "flex",
            alignItems: "center",
            gap: 32,
            padding: "48px 72px",
            opacity: titleOpacity,
            transform: `translateX(${titleX}px)`,
            zIndex: 10,
          }}
        >
          <h1
            style={{
              fontWeight: 900,
              lineHeight: 1,
              letterSpacing: "-0.025em",
              fontSize: 64,
              color: "#F9FAFB",
              textShadow: "0 4px 24px rgba(0,0,0,0.45)",
              fontFamily: "'SF Pro Display', sans-serif",
              margin: 0,
            }}
          >
            What They Say?
          </h1>

          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {DATA.map((_, i) => (
              <div
                key={i}
                style={{
                  borderRadius: 9999,
                  width: activeIndex === i ? 28 : 8,
                  height: 8,
                  background:
                    activeIndex === i ? "#7C3AED" : "rgba(255,255,255,0.2)",
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* ── 5. Scrolling testimonial cards — zIndex 2 ────────────────────── */}
      {!showIntro &&
        DATA.map((testimonial, i) => {
          const distance = i - activeIndex;
          const isHero = distance === 0;
          const isLeaving = distance === -1;

          let yOffset: number;
          let cardOpacity: number;

          if (isHero) {
            // Enter from below → center
            const entryY = interpolate(positionSpring, [0, 1], [SCROLL_OFFSET, 0]);

            if (i === DATA.length - 1) {
              // Last card (i=2) starts at adjustedFrame = 2*120 = 240.
              // Outro starts at frame 420 → adjustedFrame 360 → frameInSegment 120.
              // Fade+lift over last 30 frames of segment: frameInSegment 90 → 120.
              const exitP = interpolate(frameInSegment, [90, 120], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              });
              yOffset = entryY - exitP * SCROLL_OFFSET;
              cardOpacity = interpolate(frameInSegment, [90, 120], [1, 0], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              });
            } else {
              yOffset = entryY;
              cardOpacity = 1;
            }
          } else if (isLeaving) {
            // Exit center → above
            yOffset = interpolate(positionSpring, [0, 1], [0, -SCROLL_OFFSET]);
            cardOpacity = interpolate(positionSpring, [0, 1], [1, 0]);
          } else {
            // All others: invisible, parked out of the way
            yOffset = distance > 0 ? SCROLL_OFFSET * 2 : -SCROLL_OFFSET * 2;
            cardOpacity = 0;
          }

          return (
            <div
              key={testimonial.name}
              style={{
                position: "absolute",
                top: "50%",
                left: CARD_PADDING_X,
                right: CARD_PADDING_X,
                transform: `translateY(calc(-50% + ${yOffset}px))`,
                opacity: cardOpacity,
                zIndex: 2,
                pointerEvents: isHero ? "auto" : "none",
              }}
            >
              <TestimonialCard
                testimonial={testimonial}
                index={i}
                active={isHero}
                wasActive={isLeaving}
                frameInSegment={frameInSegment}
              />
            </div>
          );
        })}

      {/* ── 6. Outro slide — zIndex 20 ───────────────────────────────────── */}
      {showOutro && (
        <AbsoluteFill
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            opacity: outroOpacity,
            zIndex: 20,
          }}
        >
          <div
            style={{
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              transform: `scale(${outroScale})`,
            }}
          >
            <h2
              style={{
                fontWeight: 900,
                lineHeight: 1,
                marginBottom: 32,
                fontSize: 96,
                color: "#F9FAFB",
                textShadow: "0 4px 24px rgba(0,0,0,0.45)",
                fontFamily: "'SF Pro Display', sans-serif",
                letterSpacing: "0.05em",
                marginTop: 0,
              }}
            >
              Connect with me on{" "}
              <span
                style={{
                  background: "linear-gradient(90deg, #FACC15, #FDE68A)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                topmate
              </span>
            </h2>

            {topmateLink && topmateLink.trim() !== "" && (
              <div
                style={{
                  borderRadius: 9999,
                  paddingLeft: 48,
                  paddingRight: 48,
                  paddingTop: 24,
                  paddingBottom: 24,
                  marginTop: 16,
                  background: "rgba(255,255,255,0.12)",
                  backdropFilter: "blur(12px)",
                  WebkitBackdropFilter: "blur(12px)",
                  border: "1px solid rgba(255,255,255,0.2)",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
                }}
              >
                <p
                  style={{
                    fontWeight: 700,
                    fontSize: 48,
                    fontFamily: "Inter, sans-serif",
                    color: "#F9FAFB",
                    textShadow: "0 4px 24px rgba(0,0,0,0.45)",
                    margin: 0,
                  }}
                >
                  {topmateLink}
                </p>
              </div>
            )}

            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 12,
                marginTop: 40,
              }}
            >
              <div style={{ width: 64, height: 4, borderRadius: 9999, backgroundColor: "#A855F7" }} />
              <div style={{ width: 32, height: 4, borderRadius: 9999, backgroundColor: "rgba(168, 85, 247, 0.5)" }} />
              <div style={{ width: 16, height: 4, borderRadius: 9999, backgroundColor: "rgba(168, 85, 247, 0.25)" }} />
            </div>
          </div>
        </AbsoluteFill>
      )}

    </AbsoluteFill>
  );
};
