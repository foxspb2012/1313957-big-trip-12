import SortView from '../view/trip-sort.js';
import DayView from '../view/trip-days.js';
import DaysListView from '../view/trip-days-container.js';
import WithoutEvent from '../view/without-event.js';
import EventPresenter from './event.js';
import {render, RenderPosition, replace, remove} from '../utils/render';
import {sortByPrice, sortByTime, sortByStartTime} from '../utils/common.js';
import {SortType} from '../const.js';
import EventNewPresenter from './event-new.js';
import {UpdateType, UserAction, filter, FilterType} from '../const.js';

export default class Trip {
  constructor(tripContainer, eventsModel, filterModel) {
    this._tripContainer = tripContainer;
    this._currentSortType = SortType.DEFAULT;
    this._filterModel = filterModel;
    this._eventsModel = eventsModel;
    this._eventPresenter = {};

    this._sortComponent = null;
    this._dayListComponent = new DaysListView();
    this._withoutEventComponent = new WithoutEvent();
    this._sortTypeChangeHandler = this._sortTypeChangeHandler.bind(this);
    this._eventChangeHandler = this._eventChangeHandler.bind(this);
    this._modeChangeHandler = this._modeChangeHandler.bind(this);
    this._filterTypeChangeHandler = this._filterTypeChangeHandler.bind(this);
    this._modelEventsChangeHandler = this._modelEventsChangeHandler.bind(this);
    this._eventNewPresenter = new EventNewPresenter(this._dayListComponent, this._eventChangeHandler);
  }

  init() {
    if (this._eventsModel.length === 0) {
      this._renderWithoutEvent();
    } else {
      this._currentSortType = SortType.DEFAULT;
      this._eventsModel.addObserver(this._modelEventsChangeHandler);
      this._filterModel.addObserver(this._modelEventsChangeHandler);
      this._renderSort();
      this._renderEvents();
    }
  }

  createEvent() {
    this._currentSortType = SortType.DEFAULT;
    this._filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this._eventNewPresenter.init();
  }

  destroy() {
    this._clearEvents();
    this._clearSort();

    this._eventsModel.removeObserver(this._modelEventsChangeHandler);
    this._filterModel.removeObserver(this._modelEventsChangeHandler);
  }

  _getEvents() {
    const filterType = this._filterModel.getFilter();
    const events = this._eventsModel.getEvents();
    const filteredEvents = filter[filterType](events);

    switch (this._currentSortType) {
      case SortType.TIME:
        return filteredEvents.sort(sortByTime);
      case SortType.PRICE:
        return filteredEvents.sort(sortByPrice);
    }

    return filteredEvents.sort(sortByStartTime);
  }

  _modelEventsChangeHandler(updateType, update) {
    switch (updateType) {
      case UpdateType.PATCH:
        this._eventPresenter[update.id].init(update);
        break;
      case UpdateType.MINOR:
        this._clearEvents();
        this._renderEvents();
        break;
      case UpdateType.MAJOR:
        this._renderSort();
        this._clearEvents();
        this._renderEvents();
        break;
    }
  }

  _filterTypeChangeHandler(filterType) {
    this._filterModel.setFilter(UpdateType.MAJOR, filterType);
  }

  _eventChangeHandler(actionType, updateType, update) {
    switch (actionType) {
      case UserAction.ADD_EVENT:
        this._eventsModel.addEvent(updateType, update);
        break;
      case UserAction.DELETE_EVENT:
        this._eventsModel.deleteEvent(updateType, update);
        break;
      case UserAction.EDIT_EVENT:
        this._eventsModel.updateEvent(updateType, update);
        break;
    }
  }

  _renderEvents(trips = this._getEvents().slice()) {
    const isSortDefault = this._currentSortType === SortType.DEFAULT;
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
    this._currentSortType = sortType;
    this._clearEvents();
    this._renderEvents();
  }

  _renderSort() {
    const prevSortComponent = this._sortComponent;
    this._sortComponent = new SortView(Object.values(SortType), this._currentSortType);
    this._sortComponent.setSortTypeChangeHandler(this._sortTypeChangeHandler);

    if (prevSortComponent === null) {
      render(this._tripContainer, this._sortComponent, RenderPosition.BEFOREEND);
      return;
    }

    replace(this._sortComponent, prevSortComponent);
  }

  _clearSort() {
    if (this._sortComponent !== null) {
      remove(this._sortComponent);
    }
    this._sortComponent = null;
  }

  _modeChangeHandler() {
    this._eventNewPresenter.destroy();
    Object.values(this._eventPresenter).forEach((presenter) => presenter.resetView());
  }

  _renderEvent(eventList, event) {
    const eventPresenter = new EventPresenter(eventList, this._eventChangeHandler, this._modeChangeHandler);
    eventPresenter.init(event);
    this._eventPresenter[event.id] = eventPresenter;
  }

  _clearEvents() {
    this._eventNewPresenter.destroy();
    Object.values(this._eventPresenter).forEach((presenter) => presenter.destroy());
    this._eventPresenter = {};
    this._dayListComponent.getElement().innerHTML = ``;
  }
}

