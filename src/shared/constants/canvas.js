export const CANVAS = {
  WIDTH: 800,
  HEIGHT: 600
}

const row_adjustment = 0.66
export const ROWS = 6;
export const ROW_SPACING = (CANVAS.HEIGHT / ROWS) * row_adjustment;

export const COLS = 12;
export const COL_SPACING = CANVAS.WIDTH / COLS;

// leave extra space at top of frame to drop chips
export const VERTICAL_MARGIN = ROW_SPACING * 1.5;
// offset columns in odd rows by half
export const HORIZONTAL_OFFSET = COL_SPACING / 2;
