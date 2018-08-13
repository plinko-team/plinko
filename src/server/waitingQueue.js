export default class WaitingQueue {
  constructor() {
    this.queue = [];
  }

  get length() {
    return this.queue.length;
  }

  enqueue(user) {
    if (user) {
      user.setWaiting();
      this.queue.push(user);
    } else {
      console.log('Caution: attempted to enqueue a user that does not exist')
    }
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
