export default class SnapshotHistory {
  constructor() {
    this.MAX_LENGTH = Infinity;
    this.history = {}
    this.firstFrame = null;
    this.lastFrame = null;
    this.length = 0;
  }

  isEmpty() {
    return this.length === 0;
  }

  push(frame, snapshot) {
    if (this.isEmpty()) {
      this.firstFrame = frame;
    }

    this.history[frame] = snapshot;
    this.lastFrame = frame;

    this.length++;

    if (this.length > this.MAX_LENGTH) {
      this.shift();
    }
  }

  shift() {
    if (this.isEmpty()) { return false }
    delete this.history[this.firstFrame];
    this.firstFrame++;
    this.length--
  }

  at(frame) {
    if (this.history[frame] === undefined) {
      throw new Error('Frame does not exist')
    }

    return this.history[frame];
  }

  update(frame, snapshot) {
    this.history[frame] = snapshot;
  }
}
