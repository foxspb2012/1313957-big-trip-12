import AbstractView from './abstract.js';
import {MenuItem} from '../const.js';

const createSiteMenuTemplate = () => {
  return (
    `<nav class="trip-controls__trip-tabs  trip-tabs">
      <a class="trip-tabs__btn  trip-tabs__btn--active" href="#" data-menu-item="${MenuItem.TABLE}">Table</a>
      <a class="trip-tabs__btn" href="#" data-menu-item="${MenuItem.STATS}">Stats</a>
    </nav>`
  );
};

export default class Menu extends AbstractView {
  constructor() {
    super();
    this._menuClickHandler = this._menuClickHandler.bind(this);
  }

  getTemplate() {
    return createSiteMenuTemplate();
  }

  setMenuItem(menuItem) {
    const item = this.getElement().querySelector(`[data-menu-item="${menuItem}"]`);
    item.className.add(`trip-tabs__btn--active`);
  }

  setMenuClickHandler(callback) {
    this._callback.menuClick = callback;
    this.getElement().addEventListener(`click`, this._menuClickHandler);
  }

  _menuClickHandler(evt) {
    if (evt.target.tagName === `A`) {
      evt.preventDefault();
      this.getElement().querySelectorAll(`a`).forEach((elem) => {
        elem.className = `trip-tabs__btn`;
      });
      evt.target.classList.add(`trip-tabs__btn--active`);
      this._callback.menuClick(evt.target.dataset.menuItem);
    }
  }
}
