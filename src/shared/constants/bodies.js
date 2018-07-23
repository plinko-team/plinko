export const PEG_FRICTION = 1;
export const PEG_RESTITUTION = .7;
export const PEG_RADIUS = 4;
export const PEG_DIAMETER = PEG_RADIUS * 2;
export const CHIP_DENSITY = 0.00001;
export const CHIP_FRICTION = 1;
export const CHIP_RESTITUTION = .7;
export const CHIP_RADIUS = 15;
export const CHIP_DIAMETER = CHIP_RADIUS * 2;
export const WALL_FRICTION = 0.1;
export const WALL_RESTITUTION = .1;

export const TRIANGLE = {
  FRICTION: 0.1,
  RESTITUTION: 0.1,
  RIGHT: {
    X_OFFSET: 13,
    Y_OFFSET: 15,
    VERTICES: '50 150 15 75 50 0',
  },
  LEFT: {
    X_OFFSET: 15,
    Y_OFFSET: 5,
    VERTICES: '50 150 85 75 50 0',
  },
}
