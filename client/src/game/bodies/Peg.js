import { PEG } from '../../shared/constants/bodies';
import { PEG_TINT } from '../../shared/constants/colors';
import { PEG_SPRITE } from '../../shared/constants/sprites';
import GameObject from './GameObject';

export default class Peg extends GameObject {
  constructor({ id, x, y }) {
    super({ id, x, y });
    this.ownerId = null;
    this.type = 'peg';
    // this.createSprite();
    // this.sprite.parentObject = this;
  }

  // createSprite() {
  //   const peg = new PIXI.Sprite.fromImage(PEG_SPRITE);
  //
  //   peg.position.x = this.x;
  //   peg.position.y = this.y;
  //   peg.height = PEG.DIAMETER;
  //   peg.width = PEG.DIAMETER;
  //   peg.tint = PEG_TINT;
  //   peg.anchor.set(0.5, 0.5);
  //
  //   this.sprite = peg;
  // }

  draw(rough) {
    rough.circle(this.x, this.y, PEG.DIAMETER);
  }
}
