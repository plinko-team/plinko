import { TRIANGLE } from '../../shared/constants/bodies';
import { TRIANGLE_LEFT_SPRITE, TRIANGLE_RIGHT_SPRITE } from '../../shared/constants/sprites';
import { WALL_TINT } from '../../shared/constants/colors';
import GameObject from './GameObject';

let PIXI = require('pixi.js');

export default class Triangle extends GameObject {
  constructor({ x, y, side }) {

    super({ x, y })
    this.side = side;
    this.vertices = side === 'right' ? TRIANGLE.RIGHT.VERTICES : TRIANGLE.LEFT.VERTICES;
    console.log('new triangle!, x:', this.x, 'y:', this.y)
  }

// add unique ids to triangles, they are overwriting each other
  draw(rough) {
      // { x: 28,  y: 305, side: 'left' }
    const height = 150;
    const width = 35;

    if (this.side === 'left') {
      const vertices = [
        [this.x, this.y + 48 + height],  // bottom left
        [this.x + width, this.y + 48 + (height / 2)],   // middle right
        [this.x, this.y + 48]     // top left
      ];
      rough.polygon(vertices);
    } else {
      const vertices = [[50, 150], [15, 75], [50, 0]];
      rough.polygon(vertices);
    }
  }

  // createSprite() {
  //   const sprite = this.side === 'left' ? TRIANGLE_LEFT_SPRITE : TRIANGLE_RIGHT_SPRITE;
  //   const triangle = new PIXI.Sprite.fromImage(sprite);
  //
  //   // The sprite is located based on the actual x, y passed into Triangle
  //   triangle.position.x = this.x;
  //   triangle.position.y = this.y;
  //   triangle.scale.set(0.33, 0.33);
  //   triangle.anchor.set(0.5, 0.5);
  //   triangle.tint = WALL_TINT;
  //
  //   this.sprite = triangle;
  // }
}
