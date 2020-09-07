import {getFormatDate, createElement} from '../utils.js';

const createTripDaysItemTemplate = (day, index) => {
  const date = getFormatDate(day);

  return (
    `<li class="trip-days__item  day">
      <div class="day__info">
        <span class="day__counter">${index + 1}</span>
        <time class="day__date" datetime="2019-03-18">${date}</time>
      </div>
      <ul class="trip-events__list"></ul>
    </li>`
  );
};

export default class Day {
  constructor(day, index) {
    this._day = day;
    this._index = index;
    this._element = null;
  }

  getTemplate() {
    return createTripDaysItemTemplate(this._day, this._index);
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
