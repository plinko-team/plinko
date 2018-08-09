import { PEG } from '../../shared/constants/bodies';
import { PEG_TINT } from '../../shared/constants/colors';
import { PEG_SPRITE } from '../../shared/constants/sprites';
import { PLAYER_COLORS } from '../../shared/constants/colors';
import GameObject from './GameObject';

export default class Peg extends GameObject {
  constructor({ id, x, y }) {
    super({ id, x, y });
    this.ownerId = null;
    this.type = 'peg';
  }

  draw(rough) {
    rough.circle(this.x, this.y, PEG.DIAMETER, {
      fill: PLAYER_COLORS[this.ownerId],
      fillStyle: 'solid',
      roughness: 0.5,
    });
  }
}
