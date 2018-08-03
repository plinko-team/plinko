export default class WaitingQueue () {
  constructor() {
    this.queue = [];
  }

  get length() {
    return this.queue.length;
  }

  enqueue(player) {
    player.setWaiting();
    this.queue.push(player);
  }

  dequeue() {
    let player = this.queue.shift();

    if (player) {
      player.setActive();
      return player;
    } else {
      return false;
    }
  }
}
