import { CHIP_DIAMETER } from './bodies'

export const CANVAS_WIDTH = 800;
export const CANVAS_HEIGHT = 600;

const ROW_ADJUSTMENT = 0.66
export const ROWS = 6;
export const ROW_SPACING = (CANVAS_HEIGHT / ROWS) * ROW_ADJUSTMENT;

export const COLS = 12;
export const COL_SPACING = CANVAS_WIDTH / COLS;

// leave extra space at top of frame to drop chips
export const VERTICAL_MARGIN = ROW_SPACING * 1.5;
// offset columns in odd rows by half
export const HORIZONTAL_OFFSET = COL_SPACING / 2;
