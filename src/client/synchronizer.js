import { avg, median, sum, standardDeviation } from '../utils/math.js';

/**

  The synchronizer is a class that communicate to the server
  and synchronizes the client clock to the server clock by
  calculating the average ping over a period of time and
  figuring out the server clock offset;

**/

export default class Synchronizer {
  constructor(socket) {
    this.genesisTime = Date.now();
    this.serverOffset = 0;
    this.rtt = null;
    this.avgLatency = null;
    this.history = [];
    this.socket = socket;
  }

  init() {
    this.startSyncing();
  }

  get localTime() {
    return Date.now();
  }

  get actualTime() {
    return Date.now() + this.serverOffset
  }

  startSyncing(interval=1000) {
    let time;

    setInterval(() => {
      this._lastSyncTime = Date.now();
      this.socket.emit('pingMessage', { ping: true })
    }, interval)

    this.socket.on('pongMessage', this.sync)
  }

  sync({ serverTime }) {
    let latency = (Date.now() - this._lastSyncTime) / 2;
    this.history.push(latency);

    // Truncate to only 10 latencies in history
    this.history = this.history.splice(-11, 10);

    // Don't filter around median unless history buffer is full
    // Otherwise you will constantly filter out valid latencies
    if (this.history.length === 10) {
      this.history = this.filterSDAroundMedian(this.history)
    }

    this.serverOffset = Date.now() - (serverTime + avg(this.history))

    console.log(`${i}: Actual time: ${actualTime}, now: ${Date.now()}`)
    console.log(`Differential: ${actualTime - Date.now()}`)
  }

  filterSDAroundMedian(array) {
    let medianValue = median(array);
    let standardDev = standardDeviation(array, true);
    console.log(`Median: ${medianValue}`)
    console.log(`Range: (${medianValue - standardDev}, ${medianValue + standardDev})`)

    return array.filter(num => {
      return num < (medianValue + standardDev) && num > (medianValue - standardDev)
    })
  }
}
