import { WALL_TINT } from '../../shared/constants/colors';
import GameObject from './GameObject';

import { CANVAS } from '../../shared/constants/canvas';

export default class Triangle extends GameObject {
  constructor({ y, side }) {
    super({ y });
    this.side = side;
  }

  draw(rough) {
    const height = 150;
    const width = 35;
    let vertices;

    if (this.side === 'left') {
      vertices = [
        [0, this.y],                                    // top left
        [0 + width, this.y + (height / 2)],             // middle right
        [0, this.y + height],                           // bottom left
      ];
    } else {
      vertices = [
        [CANVAS.WIDTH, this.y],                         // top right
        [CANVAS.WIDTH - width, this.y + (height / 2)],  // middle left
        [CANVAS.WIDTH, this.y + height],                // bottom right
      ]
    }

    rough.polygon(vertices, {
      fill: WALL_TINT,
      stroke: WALL_TINT,
      fillStyle: 'solid',
      roughness: 0.8,
    });
  }
}
