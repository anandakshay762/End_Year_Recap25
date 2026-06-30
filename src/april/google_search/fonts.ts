import { loadFont } from "@remotion/google-fonts/Inter";

// Restrict to the Latin subset — without this Remotion fetches every subset
// (latin-ext, cyrillic, greek, vietnamese, …) which is ~9× more requests per
// weight. Each fetch wraps in delayRender(), so cutting subsets is the single
// biggest font-loading speedup.
export const { fontFamily } = loadFont("normal", {
  weights: ["400", "500", "700", "800"],
  subsets: ["latin"],
  ignoreTooManyRequestsWarning: true,
});
