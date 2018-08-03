export default class User {
  constructor({ name, socket }) {
    this.name = name;
    this.socket = socket;
    this.userId = null;
    this.status = null;
  }

  setActive() {
    this.status = 'active';
  }

  setWaiting() {
    this.status = 'waiting';
  }

  resetStatus() {
    this.status = null;
  }

  setUserId(id) {
    this.userId = id;
  }
}
