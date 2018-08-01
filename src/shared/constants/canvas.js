const ROW_ADJUSTMENT = 0.66;

export const CANVAS = {
  WIDTH: 800,
  HEIGHT: 600,
  ROWS: 6,
  ROW_SPACING: (CANVAS.HEIGHT / ROWS) * ROW_ADJUSTMENT,
  COLS: 12,
  COL_SPACING: COL_SPACING = CANVAS.WIDTH / COLS,
  // leave extra space at top of frame to drop chips
  VERTICAL_MARGIN: VERTICAL_MARGIN = ROW_SPACING * 1.5,
  // offset columns in odd rows by half
  HORIZONTAL_OFFSET: HORIZONTAL_OFFSET = COL_SPACING / 2
}
