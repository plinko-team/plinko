
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
    this.next = null;
    this.frame = frame;
    this.x = x;
    this.y = y;
    this.ownerId = ownerId;
    this.id = id;
  }
}
//
// let inputs = []
// let buffer = new InputBuffer()
// for (let i = 0; i < 1000; i++) {
//   let input = new Input({frame: Math.ceil(Math.random() * 10000 )})
//   inputs.push(input)
// }
// inputs.forEach(input => buffer.insert(input))
// buffer.traverse(i => console.log(i.frame))
