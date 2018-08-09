import { avg, median, standardDeviation } from '../shared/utils/math.js';
import { PING_MESSAGE,
         PONG_MESSAGE,
         INITIATE_SYNC,
         HANDSHAKE_COMPLETE } from '../shared/constants/events';
import EventEmitter from 'eventemitter3';
/**

  The synchronizer is a class that communicate to the server
  and synchronizes the client clock to the server clock by
  calculating the average ping over a period of time and
  figuring out the server clock offset;

**/

export default class Synchronizer {
  constructor(socket, eventEmitter) {
    this.socket = socket;
    this.eventEmitter = eventEmitter || new EventEmitter();
  }

  init() {
    this.serverOffset = 0;
    this.rtt = null;
    this.latency = null;
    this.history = [];
    this.handshakeComplete = false; // Will be set to true after 10 pings
    this.pingEmitTimes = [];
    this.registerSocketEvents();
    this.registerEmitterEvents();

    return this;
  }

  reset() {
    // Reset values needed for handshake
    this.history = [];
    this.handshakeComplete = false;
  }

  registerSocketEvents() {
    this.socket.on(PONG_MESSAGE, this.sync.bind(this));
  }

  registerEmitterEvents() {
    this.eventEmitter.on(INITIATE_SYNC, () => {
      console.log("Initiated handshake after initial sync")
      this.reset();
      this.handshake();
    })

    this.eventEmitter.on(HANDSHAKE_COMPLETE, () => {
      clearInterval(this.pingInterval);
      this.handshakeComplete = true;
    });
  }

  get localTime() {
    return Date.now();
  }

  get actualTime() {
    return Date.now() + this.serverOffset;
  }

  pingOnInterval(intervalTime) {
    let interval = setInterval(() => {
      this.pingEmitTimes.push(performance.now());

      this.socket.emit(PING_MESSAGE, { ping: true })

    }, intervalTime)

    return interval
  }

  handshake() {
    this.reset()

    this.pingInterval = this.pingOnInterval(150);

    return new Promise((resolve) => {
      this.eventEmitter.on(HANDSHAKE_COMPLETE, () => {
        resolve(this.latency);
      })
    })
  }

  sync({ serverTime }) {
    let latency = (performance.now() - this.pingEmitTimes.shift()) / 2;
    this.history.push(latency);

    // Truncate to only 10 latencies in history
    this.history = this.history.splice(-11, 10);

    // Don't filter around median unless history buffer is full
    // Otherwise you will constantly filter out valid latencies
    if (this.history.length === 10) {
      this.history = this._filterStandardDeviationAroundMedian(this.history);

      this.latency = avg(this.history);
      console.log("========> New latency: ", this.latency);

      !this.handshakeComplete && this.eventEmitter.emit(HANDSHAKE_COMPLETE);


      this.serverOffset = performance.now() - (serverTime + this.latency);
    }
  }

  _filterStandardDeviationAroundMedian(array) {
    let medianValue = median(array);
    let standardDev = standardDeviation(array, true);

    return array.filter(num => {
      return num < (medianValue + standardDev) && num > (medianValue - standardDev)
    })
  }
}
