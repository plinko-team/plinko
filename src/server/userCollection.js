export default class UserCollection {
  constructor() {
    this.users = {};
  }

  get length() {
    return Object.keys(this.users).length
  }

  add(user) {
    this.users[user.userId] = user;
  }

  delete(user) {
    if (user && this.users[user.userId]) {
      delete this.users[user.userId];
    }
  }

  get(userId) {
    return this.users[userId];
  }

  forEach(cb) {
    for (let userId in this.users) {
      cb(this.users[userId]);
    }
  }

  broadcastAll(eventName) {
    for (let userId in this.users) {
      // console.log(`Emitting: ${eventName} to ${userId}`)
      this.users[userId].socket.emit(eventName)
    }
  }
}
