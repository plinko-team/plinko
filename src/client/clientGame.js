import { Events } from 'matter-js';
import Chip from '../shared/bodies/Chip';
import HoverChip from '../shared/bodies/HoverChip';
import { DROP_BOUNDARY } from '../shared/constants/game'
import Game from '../shared/game';
import createEnvironment from '../shared/setup'

export default class ClientGame extends Game {
  constructor({ engine, renderer, stage }) {
    super({ engine });
    this.renderer = renderer;
    this.stage = stage;
    this.env = 'client';
  }

  init() {
    createEnvironment(this.stage);
    this.registerPhysicsEvents();
    this.registerCanvasEvents();
  }

  onClick = (e) => {
    e.preventDefault();

    // Short circuit handler if outside of drop boundary
    if (e.offsetY > DROP_BOUNDARY) { return }

    const chip = new Chip({ x: e.offsetX, y: e.offsetY });

    chip.addToEngine(this.engine.world);
    chip.addToRenderer(this.stage);
    this.chips.push(chip)
    this.renderer.render(this.stage);
  }

  onMouseEnter = (e) => {
    const x = e.offsetX;
    const y = e.offsetY;
    const hoverChip = new HoverChip({ x, y });
    hoverChip.addToRenderer(this.stage);

    e.target.addEventListener('mouseleave', () => {
      hoverChip.removeChip(this.stage);
    });
  }

  registerCanvasEvents() {
    // On click, add a chip at the mouse's x and y relative to canvas
    document.querySelector('canvas').addEventListener('click', this.onClick);

    // When the client moves the mouse, display a chip overlay
    document.querySelector('canvas').addEventListener('mouseenter', this.onMouseEnter)
  }
}
