import Abstract from './abstract.js';

export default class Smart extends Abstract {
  constructor() {
    super();
    this._trip = {};
  }

  updateElement() {
    let prevElement = this.getElement();
    const parent = prevElement.parentElement;
    this.removeElement();

    const newElement = this.getElement();

    parent.replaceChild(newElement, prevElement);
    prevElement = null;

    this.restoreHandlers();
  }

  restoreHandlers() {
    throw new Error(`Abstract method not implemented: resetHandler`);
  }

  updateData(update) {
    if (!update) {
      return;
    }

    this._trip = Object.assign({}, this._trip, update);
    this.updateElement();
  }
}
