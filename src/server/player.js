export default class Player {
  constructor({ name, socket }) {
    this.name = name;
    this.socket = socket;
    this.playerId = null;
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

  setPlayerId(id) {
    this.playerId = id;
  }
}
