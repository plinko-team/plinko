import shortid from 'shortid'

export default class Users {
  constructor() {
    this.knownUsers = {};
  }

  get length() {
    return Object.keys(this.knownUsers).length
  }

  add(user) {
    user.uuid = this.generateUUID()
    this.knownUsers[user.uuid] = user;
  }

  delete(user) {
    delete this.knownUsers[user.uuid];
  }

  getByUUID(uuid) {
    return this.knownUsers[uuid];
  }

  forEach(cb) {
    for (let uuid in this.knownUsers) {
      cb(this.knownUsers[uuid]);
    }
  }

  generateUUID() {
    return shortid.generate();
  }
}
