import AbstractView from './abstract.js';

const createSortItem = (sort, currentSort) => {
  return (
    `<div class="trip-sort__item  trip-sort__item--${sort}">
      <input id="sort-${sort}" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-${sort}" data-sort-type="${sort}" ${sort === currentSort ? `checked` : ``}>
      <label class="trip-sort__btn" for="sort-${sort}">${sort}</label>
    </div>`
  );
};

const createTripSortTemplate = (sorts, currentSort) => {
  const tripSortElement = sorts.map((sort) => createSortItem(sort, currentSort)).join(``);
  return (
    `<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
      <span class="trip-sort__item  trip-sort__item--day">Day</span>
      ${tripSortElement}
      <span class="trip-sort__item  trip-sort__item--offers">Offers</span>
    </form>`
  );
};

export default class Sort extends AbstractView {
  constructor(sorts, currentSort) {
    super();
    this._sorts = sorts;
    this._currentSort = currentSort;

    this._sortTypeChangeHandler = this._sortTypeChangeHandler.bind(this);
  }

  getTemplate() {
    return createTripSortTemplate(this._sorts, this._currentSort);
  }

  _sortTypeChangeHandler(evt) {
    evt.preventDefault();
    this._callback.sortTypeChange(evt.target.dataset.sortType);
  }

  setSortTypeChangeHandler(callback) {
    this._callback.sortTypeChange = callback;
    this.getElement().addEventListener(`change`, this._sortTypeChangeHandler);
  }
}
