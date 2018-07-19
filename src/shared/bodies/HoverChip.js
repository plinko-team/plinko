import { CHIP_DIAMETER } from '../constants/bodies';
import { DROP_BOUNDARY } from '../constants/game';
import { CHIP_SPRITE } from '../constants/sprites';
import { CANVAS_COLOR, PLAYER_COLORS, HOVER_CHIP_TRANSPARENCY } from '../constants/colors';

import GameObject from './GameObject';
import * as PIXI from 'pixi.js'

export default class HoverChip extends GameObject {
  constructor({ x, y, ownerId }) {
    super({ x, y, ownerId });
    this.type = 'hover_chip';
    if (typeof window === 'object') { this.createSprite() };
    this.registerListener();
  }

  registerListener() {
    document.querySelector('canvas').addEventListener('mousemove', (e) => {
      const x = e.offsetX;
      const y = e.offsetY;

      // Change color if cursor crosses boundary
      this.sprite.tint = y > DROP_BOUNDARY ? CANVAS_COLOR : PLAYER_COLORS[this.ownerId];

      this.sprite.position.x = x;
      this.sprite.position.y = y;
    });
  }

  removeChip(stage) {
    stage.removeChild(this.sprite);
  }

  createSprite() {
    const chip = new PIXI.Sprite.fromImage(CHIP_SPRITE);
    chip.position.x = this.x;
    chip.position.y = this.y;
    chip.alpha = HOVER_CHIP_TRANSPARENCY;
    chip.height = CHIP_DIAMETER;
    chip.width = CHIP_DIAMETER;
    chip.anchor.set(0.5, 0.5);

    this.sprite = chip;
  }
}
