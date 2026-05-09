/**
 * court-dimensions.ts — NBA regulation court dimensions in feet.
 *
 * Coordinate origin: bottom-left corner of the court (offensive basket end).
 * X: horizontal, 0 = left sideline, 50 = right sideline.
 * Y: vertical, 0 = baseline (under hoop), 94 = far baseline (full court).
 *
 * For half-court views, Y is clamped to [0, 47].
 *
 * Sources:
 *   - NBA Official Rulebook 2023–24, Rule 1 Section I
 *   - https://www.nba.com/stats/help/court-dimensions (accessed 2026-05-09)
 */

export const COURT = {
  /** Full court dimensions. */
  fullWidth: 50,   // feet, sideline to sideline
  fullLength: 94,  // feet, baseline to baseline

  /** Half-court length used for shot charts. */
  halfLength: 47,

  /** Hoop center position (half-court, from bottom baseline). */
  hoop: {
    x: 25,    // center of court horizontally
    y: 4.75,  // from baseline — center of the rim
    radius: 0.75, // rim radius
  },

  /** Backboard. */
  backboard: {
    x1: 22,
    x2: 28,
    y: 4,
  },

  /** Restricted area arc. */
  restrictedArea: {
    radius: 4,  // feet from hoop center
  },

  /** Paint / key dimensions. */
  paint: {
    x1: 19,   // left edge
    x2: 31,   // right edge
    y2: 19,   // top of key (from baseline)
    freeThrowLine: 19, // same as y2
    freeThrowRadius: 6,
  },

  /** Three-point arc. */
  threePoint: {
    /** Straight sideline segments. */
    cornerX1: 3,    // distance from sideline
    cornerX2: 47,   // from left sideline (50-3)
    cornerY: 14,    // from baseline — corner three straight
    /** Arc center — same x as hoop. */
    centerX: 25,
    centerY: 4.75,
    radius: 23.75,  // feet from hoop center
  },

  /** Center circle (half-court line side). */
  centerCircle: {
    x: 25,
    y: 47,  // half-court line
    radius: 6,
  },

  /** Mid-range / lane circles. */
  freeThrowCircle: {
    x: 25,
    y: 19,
    radius: 6,
  },
} as const

export type CourtDimensions = typeof COURT
