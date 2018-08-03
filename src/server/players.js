import shortid from 'shortid'

export default class Players {
  constructor() {
    this.knownPlayers = {};
  }

  get length() {
    return Object.keys(this.knownPlayers).length
  }

  add(player) {
    player.uuid = this.generateUUID()
    this.knownPlayers[player.uuid] = player;
  }

  delete(player) {
    delete this.knownPlayers[player.uuid];
  }

  getByUUID(uuid) {
    return this.knownPlayers[uuid];
  }

  forEach(cb) {
    for (let uuid in this.knownPlayers) {
      cb(this.knownPlayers[uuid]);
    }
  }

  generateUUID() {
    return shortid.generate();
  }
}
