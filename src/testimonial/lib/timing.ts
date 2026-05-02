/** Frames for the enter spring to complete (~4-6 frames at 30fps). */
export const ENTER_F = 5;

/** Frames a regular word holds at full visibility before exiting. */
export const HOLD_F = 7;

/** Frames for the exit spring to complete. */
export const EXIT_F = 5;

/**
 * How many frames the incoming word overlaps with the outgoing word.
 */
export const OVERLAP_F = 4;

/**
 * A word is a "focus word" if every alphabetical character is uppercase.
 */
export function detectIsFocus(text: string): boolean {
  const letters = text.replace(/[^a-zA-Z]/g, "");
  return letters.length > 0 && letters === letters.toUpperCase();
}
