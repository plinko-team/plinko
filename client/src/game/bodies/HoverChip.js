import { CHIP } from '../../shared/constants/bodies';
import { DROP_BOUNDARY } from '../../shared/constants/game';
import { PLAYER_COLORS } from '../../shared/constants/colors';

import GameObject from './GameObject';

export default class HoverChip extends GameObject {
  static count = 0;

  constructor({ x, y, ownerId }) {
    super({ x, y, ownerId });
    this.id = HoverChip.count++;
    this.type = 'hover_chip';
    this.diameter = CHIP.DIAMETER;
    this.fill = PLAYER_COLORS[this.ownerId];
    this.registerListener();
  }

  registerListener() {
    document.querySelector('canvas').addEventListener('mousemove', (e) => {
      this.x = e.offsetX;
      this.y = e.offsetY;

      // Change color if cursor crosses boundary
      this.fill = this.y > DROP_BOUNDARY ? '#ffffff' : PLAYER_COLORS[this.ownerId];
    });
  }

  draw(rough) {
    rough.circle(this.x, this.y, this.diameter, {
      fill: this.fill,
      fillStyle: 'solid',
      fillWeight: 1,
      roughness: 0.5,
    });
  }
}
