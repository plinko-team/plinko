
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
    return !this.first || this.length === 0;
  }

  shift() {
    if (this.isEmpty()) {
      return false
    }

    let first = this.first

    if (!first) {
      throw new Error("No first input for some reason", first)
    }

    if (this.length === 1) {
      this.first = null;
      this.last = null;
    } else {
      this.first = this.first.next;
    }

    this.length--;
    return first;
  }

  insert(input) {
    if (!input instanceof Input) {
      throw new Error("Not an instance of input")
    }
    if (!input) {
      throw new Error("You forgot to include an input, dummy")
    }

    if (this.isEmpty()) {
      // If the buffer is empty, this is the first and last input
      this.first = input;
      this.last = input;
    } else if (input.frame > this.last.frame) {
      // If input frame is larger than the last input,
      // input is new last input
      this.last.next = input;
      this.last = input;
    } else if (input.frame < this.first.frame) {
      // If input frame is smaller than the first input,
      // input is new first input
      input.next = this.first;
      this.first = input;
    } else {
      // Traverse to find appropriate spot for input by frame
      let currentInput = this.first;

      while (!!currentInput && !!currentInput.next && input.frame > currentInput.next.frame) {
        currentInput = currentInput.next;
      }

      input.next = currentInput.next
      currentInput.next = input
    }

    this.length++;

    return input;
  }
}

 export class Input {
  // A typical input is just dropping a chips
  // will have a frame, x, y, ownerId, id

  constructor({ frame, x, y, ownerId, id }) {
    // if (typeof frame === 'undefined') { throw new Error("Must include a frame") }

    this.next = null;
    this.frame = frame;
    this.x = x;
    this.y = y;
    this.ownerId = ownerId;
    this.id = id;
  }
}
