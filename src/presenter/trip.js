import SortView from '../view/trip-sort.js';
import DayView from '../view/trip-days.js';
import DaysListView from '../view/trip-days-container.js';
import WithoutEvent from '../view/without-event.js';
import EventPresenter from './event.js';
import {render, RenderPosition} from '../utils/render';
import {sortByPrice, sortByTime, updateItem} from '../utils/common.js';
import {SortType} from '../const.js';

export default class Trip {
  constructor(tripContainer) {
    this._tripContainer = tripContainer;
    this._trips = null;
    this._eventPresenter = {};

    this._sortComponent = new SortView();
    this._dayListComponent = new DaysListView();
    this._withoutEventComponent = new WithoutEvent();
    this._sortTypeChangeHandler = this._sortTypeChangeHandler.bind(this);
    this._eventChangeHandler = this._eventChangeHandler.bind(this);
    this._modeChangeHandler = this._modeChangeHandler.bind(this);
  }

  init(trips) {
    this._trips = trips.slice();

    if (this._trips.length === 0) {
      this._renderWithoutEvent();
    } else {
      this._renderSort();
      this._renderEvents();
    }
  }

  _eventChangeHandler(updatedEvent) {
    this._trips = updateItem(this._trips, updatedEvent);
    this._eventPresenter[updatedEvent.id].init(updatedEvent);
  }

  _renderEvents(trips = this._trips, isSortDefault = true) {
    const tripDays = [...new Set(trips.map((trip) => new Date(trip.startTime).toDateString()))];
    const days = isSortDefault ? tripDays : [true];

    days.forEach((day, index) => {
      const tripDayComponent = isSortDefault ? new DayView(day, index) : new DayView();
      const tripEventList = tripDayComponent.getElement().querySelector(`.trip-events__list`);

      trips
        .filter((trip) => isSortDefault ? new Date(trip.startTime).toDateString() === day : trip)
        .forEach((event) => this._renderEvent(tripEventList, event));

      render(this._dayListComponent, tripDayComponent, RenderPosition.BEFOREEND);
    });

    render(this._tripContainer, this._dayListComponent, RenderPosition.BEFOREEND);
  }

  _sortTypeChangeHandler(sortType) {
    const trips = this._trips.slice();
    this._clearEvents();
    switch (sortType) {
      case SortType.TIME:
        this._renderEvents(trips.sort(sortByTime), false);
        break;

      case SortType.PRICE:
        this._renderEvents(trips.sort(sortByPrice), false);
        break;

      default:
        this._renderEvents();
    }
  }

  _renderSort() {
    this._sortComponent.setSortTypeChangeHandler(this._sortTypeChangeHandler);
    render(this._tripContainer, this._sortComponent, RenderPosition.BEFOREEND);
  }

  _modeChangeHandler() {
    Object.values(this._eventPresenter).forEach((presenter) => presenter.resetView());
  }

  _renderEvent(eventList, event) {
    const eventPresenter = new EventPresenter(eventList, this._eventChangeHandler, this._modeChangeHandler);
    eventPresenter.init(event);
    this._eventPresenter[event.id] = eventPresenter;
  }

  _clearEvents() {
    Object.values(this._eventPresenter).forEach((presenter) => presenter.destroy());
    this._eventPresenter = {};
    this._dayListComponent.getElement().innerHTML = ``;
  }
}

