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
    delete this.users[user.userId];
  }

  get(userId) {
    return this.users[userId];
  }

  forEach(cb) {
    for (let userId in this.users) {
      cb(this.users[userId]);
    }
  }
}
