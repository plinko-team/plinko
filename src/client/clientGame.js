import { Events } from 'matter-js';
import Chip from '../shared/bodies/Chip';
import HoverChip from '../shared/bodies/HoverChip';
import { DROP_BOUNDARY } from '../shared/constants/game'
import Game from '../shared/game';
import createEnvironment from '../shared/setup'

export default class ClientGame extends Game {
  constructor({ renderer, stage, socket }) {
    super();
    this.socket = socket;
    this.renderer = renderer;
    this.stage = stage;
    this.env = 'client';

    this.registerSocketEvents();
  }

  registerSocketEvents() {
    this.socket.on('new chip', this.onNewChip.bind(this));
  }

  onNewChip(chipInfo) {
    const chip = new Chip(chipInfo);
<<<<<<< HEAD

    chip.addToEngine(this.engine.world);
    chip.addToRenderer(this.stage);
    this.chips.push(chip)
    this.renderer.render(this.stage);
    console.log('chip info: ', chipInfo)
  }

  init() {
    createEnvironment(this.stage, this.engine);
=======
    chip.addToEngine(this.engine.world);
    chip.addToRenderer(this.stage);
    this.chips.push(chip);
    this.renderer.render(this.stage);
  }

  init() {
    createEnvironment(this.stage, this.engine, this.pegs);
>>>>>>> aea5bf61d8a51ebf6c1fa363442d951a873d562f
    this.registerPhysicsEvents();
    this.registerCanvasEvents();
  }

  onClick = (e) => {
    e.preventDefault();
    e.stopPropagation()

    // Short circuit handler if outside of drop boundary
    if (e.offsetY > DROP_BOUNDARY) { return }

    const x = e.offsetX;
    const y = e.offsetY;

<<<<<<< HEAD
    this.socket.emit('new chip', { x, y })
=======
    this.socket.emit('new chip', { x, y, ownerId: window.playerId })
>>>>>>> aea5bf61d8a51ebf6c1fa363442d951a873d562f
  }

  onMouseEnter = (e) => {
    const x = e.offsetX;
    const y = e.offsetY;
    const hoverChip = new HoverChip({ x, y, ownerId: window.playerId });
    hoverChip.addToRenderer(this.stage);

    e.target.addEventListener('mouseleave', () => {
      hoverChip.removeChip(this.stage);
    });
  }

  registerCanvasEvents() {
    // On click, add a chip at the mouse's x and y relative to canvas
    document.querySelector('canvas').addEventListener('click', this.onClick, false);
    // We prevent the default mousedown event so that when you spam chips,
    // random parts of the DOM might get highlighted due to double click
    document.body.addEventListener('mousedown', (e) => { e.preventDefault() })
    // When the client moves the mouse, display a chip overlay
    document.querySelector('canvas').addEventListener('mouseenter', this.onMouseEnter)
  }
}
