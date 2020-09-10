import {createElement} from '../utils/render.js';

export default class Abstract {
  constructor() {
    if (new.target === Abstract) {
      throw new Error(`Невозможно создать экземпляр дял класса Astract, необходимо использовать наследование`);
    }
    this._element = null;
    this._callback = {};
  }

  getTemplate() {
    throw new Error(`Необходимо произвести описание метода getTemplate`);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }
    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
