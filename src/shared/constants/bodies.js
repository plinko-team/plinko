export const PEG = {
  FRICTION: 1,
  RESTITUTION: 0.7,
  RADIUS: 4,
}

PEG.DIAMETER = PEG.RADIUS * 2;

export const CHIP = {
  DENSITY: 1 / 100000,
  FRICTION: 1,
  RESTITUTION: 0.7,
  RADIUS: 15,
}

CHIP.DIAMETER =  CHIP.RADIUS * 2;

export const WALL = {
  FRICTION: 0.1,
  RESTITUTION: 0.1
}

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

