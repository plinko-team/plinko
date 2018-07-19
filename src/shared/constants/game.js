import { VERTICAL_MARGIN } from './canvas';
import { CHIP_RADIUS, PEG_RADIUS } from './bodies';

export const MS_IN_SECOND = 1000;
export const FPS = 30;
export const TIMESTEP = MS_IN_SECOND / FPS;

// Cannot drop chips under DROP_BOUNDARY px from top
export const DROP_BOUNDARY = VERTICAL_MARGIN - CHIP_RADIUS - PEG_RADIUS;
