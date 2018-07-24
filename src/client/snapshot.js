export class SnapshotBuffer {
  constructor() {
    this.first = null;
    this.last = null;
    this.length = 0;
  }

  isEmpty() {
    return this.first === null && this.last === null;
  }

  push(snapshot) {
    if (this.first === null) {
      this.first = snapshot;
      this.last = snapshot;
    } else {
      this.last.next = snapshot;
      this.last = snapshot;
    }

    this.length++

    return snapshot
  }

  shift() {
    if (this.first === null) {
      return false;
    }

    let snapshot = this.first;
    if (this.first.next) {
      this.first = this.first.next;
    } else {
      this.first = null;
      this.last = null;
    }

    this.length--

    return snapshot;
  }
}

export class Snapshot {
  constructor({ chips, pegs }) {
    this.chips = chips;
    this.pegs = pegs;
    this.next = null;
  }
}
