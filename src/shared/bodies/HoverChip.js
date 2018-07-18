import { CHIP_DIAMETER } from '../constants/bodies';
import { CHIP_COLOR } from '../constants/colors';
import GameObject from './GameObject';
import * as PIXI from 'pixi.js'

export default class HoverChip extends GameObject {
  constructor({ x, y }) {
    super({ x, y });
    this.type = 'hover_chip';
    if (typeof window === 'object') { this.createSprite() };
    this.registerListener();
  }

  registerListener() {
    document.querySelector('canvas').addEventListener('mousemove', (e) => {
      const x = e.offsetX;
      const y = e.offsetY;
      this.sprite.position.x = x;
      this.sprite.position.y = y;
    });
  }

  removeChip(stage) {
    stage.removeChild(this.sprite);
  }

  createSprite() {
    const chip = new PIXI.Sprite.fromImage('https://i.imgur.com/Q6GxA85.png');
    chip.position.x = this.x;
    chip.position.y = this.y;
    chip.alpha = .5;
    chip.height = CHIP_DIAMETER;
    chip.width = CHIP_DIAMETER;
    chip.anchor.set(0.5, 0.5);

    this.sprite = chip;
  }
}