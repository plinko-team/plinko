import { renderer, stage } from './renderer.js';
import Chip from '../shared/bodies/Chip';
import engine from './engine.js';

let chip = new Chip({ x: 100, y: 100});

chip.addToEngine(engine.world);
chip.addToRenderer(stage);

renderer.render(stage);
