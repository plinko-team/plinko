export default class Interval {
  constructor({ time }) {
    this.time = time;
  }

  start() { 
    setInterval(() => {
      
    }, this.time);

    return this;
  }
}
