import shortid from 'shortid'

export default class User {
  constructor({ name, socket }) {
    this.name = name;
    this.socket = socket;
    this.userId = shortid.generate();
    this.status = null;
    this.playerId = null; // integers 0-3 or null
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
}
