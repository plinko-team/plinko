export default class InputHistory {
  constructor() {
    this.history = {}
  }

  insert(input) {
    const frame = input.frame

    if (Array.isArray(this.history[frame])) {
      this.history[frame].push(input);
    } else if (this.history[frame]) {
      console.log('already here')
      const currentInputAtFrame = this.history[frame];

      this.history[frame] = [currentInputAtFrame, input];
    } else {
      this.history[frame] = input;
    }
  }

  inputsAt(frame) {
    // Always returns an array

    if (Array.isArray(this.history[frame])) {
      return this.history[frame];
    } else if (this.history[frame]) {
      return [this.history[frame]]
    } else {
      return undefined
    }
  }

  at(frame) {
    return this.history[frame]
  }
}
