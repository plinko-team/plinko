import { CANVAS } from '../../shared/constants/canvas'
import { CHIP } from '../../shared/constants/bodies';
import { DROP_BOUNDARY } from '../../shared/constants/game';
import { PLAYER_COLORS } from '../../shared/constants/colors';

import GameObject from './GameObject';

export default class HoverChip extends GameObject {
  constructor({ x, y, ownerId }) {
    super({ x, y, ownerId });
    this.type = 'hover_chip';
    this.diameter = CHIP.DIAMETER;
    this.fill = PLAYER_COLORS[this.ownerId];
    this.registerListener();
  }

  registerListener() {
    document.querySelector('#canvas').addEventListener('mousemove', (e) => {

      const parentWidth = e.target.offsetWidth;
      const parentHeight = e.target.offsetHeight;

      this.x = (e.offsetX / parentWidth) * CANVAS.WIDTH;
      this.y = (e.offsetY / parentHeight) * CANVAS.HEIGHT;



      // Change color if cursor crosses boundary
      this.fill = this.y > DROP_BOUNDARY ? '#ffffff' : PLAYER_COLORS[this.ownerId];
    });
  }

  draw(rough) {
    rough.circle(this.x, this.y, this.diameter, {
      fill: this.fill,
      fillStyle: 'solid',
      fillWeight: 1,
      roughness: .8,
    });
  }
}
