export default class WaitingQueue {
  constructor() {
    this.queue = [];
  }

  get length() {
    return this.queue.length;
  }

  enqueue(user) {
    user.setWaiting();
    this.queue.push(user);
  }

  dequeue() {
    let user = this.queue.shift();

    if (user) {
      user.setActive();
      return user;
    } else {
      return false;
    }
  }

  forEach(cb) {
    this.queue.forEach(cb);
  }
}
