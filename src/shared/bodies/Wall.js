import { Bodies, World } from 'matter-js'
import { PEG_FRICTION, PEG_RESTITUTION} from '../constants/bodies'

let PIXI;

if (typeof window === 'object') {
  PIXI = require('pixi.js');
}

class Wall {
  constructor({x, y, width, height}) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.createPhysics({ width, height });
    if (typeof window === 'object') { this.createSprite() };
  }

  createPhysics({width, height}) {
    let options = {
      restitution: PEG_RESTITUTION,
      friction: PEG_FRICTION,
    }
   
    this.body = Bodies.rectangle(this.x, this.y, this.width, this.height, options);
    this.body.isStatic = true;
    this.body.position.x = this.x;
    this.body.position.y = this.y;
    this.body.label = this.type;
    this.body.isShrinking = false;
  }

  createSprite() {
    this.sprite = new PIXI.Graphics()
    this.sprite.beginFill(0xff22aa);
    this.sprite.drawRect(this.x, this.y, this.width, this.height);
    this.sprite.endFill();
  }

  addToRenderer(stage) {
    stage.addChild(this.sprite);
  }
  
  addToEngine(world) {
    World.add(world, this.body);
  }
}

export class VerticalWall extends Wall {
  constructor({x, y, width, height}) {
    super({x, y, width, height});
  }
}

export class HorizontalWall extends Wall {
  constructor() {
    super({ x: 0,
            y: 590,
            width: 800,
            height: 10
    })
  }
}

export class BucketWall extends Wall {
  constructor({x, y, width, height}) {
    super({x, y, width, height});
  }
}