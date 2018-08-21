import { VERTICAL_MARGIN } from './canvas';
import { CHIP, PEG } from './bodies';

export const MS_IN_SECOND = 1000;
export const FPS = 60;
export const TIMESTEP = MS_IN_SECOND / FPS;
export const TARGET_SCORE = 63;

// Cannot drop chips under DROP_BOUNDARY px from top
export const DROP_BOUNDARY = VERTICAL_MARGIN - CHIP.RADIUS - PEG.RADIUS;
