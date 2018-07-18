import Game from './game'
import engine from './engine';
import { renderer, stage } from './renderer';

const game = new Game({ renderer, engine, stage })
game.init().start();
