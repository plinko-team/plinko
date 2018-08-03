import EventEmitter from 'eventemitter3';
import { Body, World, Engine, Events } from 'matter-js';
import { DROP_BOUNDARY, TIMESTEP, TARGET_SCORE } from '../shared/constants/game';
import Chip from '../shared/bodies/Chip';
import Peg from '../shared/bodies/Peg';
import Triangle from '../shared/bodies/Triangle';
import { VerticalWall, HorizontalWall, BucketWall } from '../shared/bodies/Wall';
import { Input, InputBuffer } from './inputBuffer';
import Serializer from '../shared/serializer';

import { CANVAS,
         ROWS,
         COLS,
         ROW_SPACING,
         COL_SPACING,
         VERTICAL_MARGIN,
         HORIZONTAL_OFFSET } from '../shared/constants/canvas'

import { CONNECTION,
         CONNECTION_ESTABLISHED,
         NEW_CHIP,
         PING_MESSAGE,
         PONG_MESSAGE,
         SERVER_FRAME,
         REQUEST_SERVER_FRAME,
         SNAPSHOT,
         INITIATE_SYNC,
         HANDSHAKE_COMPLETE } from '../shared/constants/events'

/**

  TODO: Write description

**/

export default class ServerEngine {
  constructor({ io }) {
    this.knownPlayers = [];
    this.io = io;
  }

  init() {

    this.registerSocketEvents();

    return this;
  }

  registerSocketEvents() {
    let playerId = 0;
    let i = 0;

    this.io.on(CONNECTION, socket => {
      this.knownPlayers.push(socket);

      socket.emit(CONNECTION_ESTABLISHED, { playerId: playerId % 4 });
      playerId++;

      // Events must be set on socket established through connection
      socket.on(PING_MESSAGE, () => {
        socket.emit(PONG_MESSAGE, { serverTime: Date.now() });
      })
    });
  }
}
