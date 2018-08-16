import shortid from 'shortid';

export default class GameObject {
  constructor({ id, x, y, ownerId }) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.ownerId = ownerId;
    this.renderId = shortid.generate();
  }
}
