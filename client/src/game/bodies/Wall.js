import { WALL_TINT } from '../../shared/constants/colors';
import { CANVAS } from '../../shared/constants/canvas';
import GameObject from './GameObject';

// in canvas, a rectangle's top left corner is rendered at x,y
// grid's x,y starts at 0,0 in top left corner of canvas

class Wall extends GameObject {
  static count = 0;

  constructor({ id, x, y, width, height }) {
    super({ x, y });
    this.id = Wall.count++;
    this.width = width;
    this.height = height;
    this.type = 'wall';
  }

  draw(rough) {
    rough.rectangle(this.x, this.y, this.width, this.height, {
      fill: WALL_TINT,
      stroke: WALL_TINT,
      fillStyle: 'solid',
      roughness: 0.2,
    });
  }

  // createSprite() {
  //   const texture = PIXI.Texture.WHITE;
  //   const wall = new PIXI.Sprite(texture);
  //   wall.position.x = this.x;
  //   wall.position.y = this.y;
  //   wall.height = this.height;
  //   wall.width = this.width;
  //   wall.tint = WALL_TINT;
  //   wall.anchor.set(0.5, 0.5);
  //
  //   this.sprite = wall;
  // }
}

export class VerticalWall extends Wall {
  constructor({x, y}) {
    super({x, y, width: 4, height: CANVAS.HEIGHT});
  }
}

export class HorizontalWall extends Wall {
  constructor() {
    const height = 10;
    const width = CANVAS.WIDTH;
    const y = CANVAS.HEIGHT - (height / 2);
    const x = 0;

    super({ x, y, width, height });
  }
}

export class BucketWall extends Wall {
  constructor({ x }) {
    const height = 115;
    const width = 5;
    const y = CANVAS.HEIGHT - height;
    x = x - (width / 2);

    super({ x, y, width, height });
  }
}
