
// insert all of these into our inputHistory O(N)
// go to frame 1
// reenact all frames up to servers presentFrame

export class InputBuffer {
  constructor() {
    this.first = null;
    this.last = null;
    this.length = 0;
  }

  traverse(callback) {
    let current = this.first;
    while (current) {
      if (callback) { callback(current) };
      current = current.next
    }
  }

  isEmpty() {
    return this.length === 0;
  }

  shift() {
    if (this.isEmpty()) {
      return false
    }

    if (this.length === 1) {
      let first = this.first;
      this.first = null;
      this.last = null;
      this.length--

      return first;
    } else {
      let first = this.first
      this.first = this.first.next;
      this.first.previous = null;
      this.length--

      return first;
    }
  }

  insert(input) {
    if (this.isEmpty()) {
      // If the buffer is empty, this is the first and last input
      this.first = input;
      this.last = input;
    } else if (input.frame > this.last.frame) {
      // If input frame is larger than the last input,
      // input is new last input
      this.last.next = input;
      input.previous = this.last;
      this.last = input;
    } else if (input.frame < this.first.frame) {
      // If input frame is smaller than the first input,
      // input is new first input
      this.first.previous = input;
      input.next = this.first;

      this.first = input;
    } else {
      // Traverse to find appropriate spot for input by frame
      let currentInput = this.first;

      while (!!currentInput && currentInput.frame < input.frame) {
        currentInput = currentInput.next;
      }

      const previous = currentInput.previous;

      previous.next = input;
      currentInput.previous = input;
      input.next = currentInput;
    }

    this.length++;

    return input;
  }
}

export class Input {
  // A typical input is just dropping a chips
  // will have a frame, x, y, ownerId, id
  constructor({ frame, x, y, ownerId, id }) {
    this.next = null;
    this.previous = null;
    this.frame = frame;
    this.x = x;
    this.y = y;
    this.ownerId = ownerId;
    this.id = id;
  }
}
