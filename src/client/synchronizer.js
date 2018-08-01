import { avg, median, sum, standardDeviation } from '../utils/math.js';
import '../shared/constants/events';
/**

  The synchronizer is a class that communicate to the server
  and synchronizes the client clock to the server clock by
  calculating the average ping over a period of time and
  figuring out the server clock offset;

**/

export default class Synchronizer {
  constructor(socket, eventEmitter) {
    this.socket = socket;
    this.eventEmitter = eventEmitter;
  }

  init() {
    this.serverOffset = 0;
    this.rtt = null;
    this.latency = null;
    this.history = [];
    this.handshakeComplete = false; // Will be set to true after 10 pings

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
      this.reset()
      this.handshake()
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
      this._lastSyncTime = performance.now();
      this.socket.emit(PING_MESSAGE, { ping: true })

    }, intervalTime)

    return interval
  }

  handshake() {
    this.pingInterval = this.pingOnInterval(100);
  }

  sync({ serverTime }) {
    let latency = (performance.now() - this._lastSyncTime) / 2;
    this.history.push(latency);

    // Truncate to only 10 latencies in history
    this.history = this.history.splice(-11, 10);

    // Don't filter around median unless history buffer is full
    // Otherwise you will constantly filter out valid latencies
    if (this.history.length === 10) {
      !this.handshakeComplete && this.eventEmitter.emit(HANDSHAKE_COMPLETE);
      this.history = this._filterStandardDeviationAroundMedian(this.history);

      this.latency = avg(this.history);
      console.log("============================")
      console.log("============================> New latency: ", this.latency)
      console.log("============================")

      this.serverOffset = performance.now() - (serverTime + this.latency);
    }
  }

  _filterStandardDeviationAroundMedian(array) {
    let medianValue = median(array);
    let standardDev = standardDeviation(array, true);
    console.log(`Median: ${medianValue}`)
    console.log(`Range: (${medianValue - standardDev}, ${medianValue + standardDev})`)

    return array.filter(num => {
      return num < (medianValue + standardDev) && num > (medianValue - standardDev)
    })
  }
}
