import SortView from '../view/sort.js';
import DayListView from '../view/day-list.js';
import DayView from '../view/day.js';
import WithoutEvent from '../view/without-event.js';
import LoadingView from '../view/loading.js';
import EventPresenter, {State as EventPresenterViewState} from './event.js';
import EventNewPresenter from './event-new.js';
import {render, RenderPosition, replace, remove} from '../utils/render';
import {SortType} from '../const.js';
import {sortByTime, sortByPrice, sortByStartTime} from '../utils/common.js';
import {UpdateType, UserAction, filter, FilterType} from '../const.js';

export default class Trip {
  constructor(tripContainer, eventsModel, filterModel, api) {
    this._tripContainer = tripContainer;
    this._eventsModel = eventsModel;
    this._filterModel = filterModel;
    this._api = api;

    this._currentSortType = SortType.DEFAULT;
    this._isLoading = true;

    this._eventPresenter = {};

    this._sortComponent = null;
    this._dayListComponent = new DayListView();
    this._WithoutEventComponent = new WithoutEvent();
    this._loadingComponent = new LoadingView();

    this._sortTypeChangeHandler = this._sortTypeChangeHandler.bind(this);
    this._eventChangeHandler = this._eventChangeHandler.bind(this);
    this._modeChangeHandler = this._modeChangeHandler.bind(this);
    this._modelEventsChangeHandler = this._modelEventsChangeHandler.bind(this);
    this._filterTypeChangeHandler = this._filterTypeChangeHandler.bind(this);

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

  destroy() {
    this._clearEvents();
    this._clearSort();

    this._eventsModel.removeObserver(this._modelEventsChangeHandler);
    this._filterModel.removeObserver(this._modelEventsChangeHandler);
  }

  createEvent() {
    this._currentSortType = SortType.DEFAULT;
    this._filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this._eventNewPresenter.init();
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
      case UpdateType.INIT:
        this._isLoading = false;
        remove(this._loadingComponent);
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
        this._eventNewPresenter.setSaving();
        this._api.addEvent(update)
        .then((response) => {
          this._eventsModel.addEvent(updateType, response);
        })
        .catch(() => {
          this._eventNewPresenter.setAborting();
        });
        break;
      case UserAction.DELETE_EVENT:
        this._eventPresenter[update.id].setViewState(EventPresenterViewState.DELETING);
        this._api.deleteEvent(update)
        .then(() => {
          this._eventsModel.deleteEvent(updateType, update);
        })
        .catch(() => {
          this._eventPresenter[update.id].setViewState(EventPresenterViewState.ABORTING);
        });
        break;
      case UserAction.EDIT_EVENT:
        this._eventPresenter[update.id].setViewState(EventPresenterViewState.SAVING);
        this._api.updateEvent(update)
        .then((response) => {
          this._eventsModel.updateEvent(updateType, response);
        })
        .catch(() => {
          this._eventPresenter[update.id].setViewState(EventPresenterViewState.ABORTING);
        });
        break;
    }
  }

  _renderEvents(trips = this._getEvents().slice()) {
    if (this._isLoading) {
      this._renderLoading();
      return;
    }

    const isDefaultSorting = this._currentSortType === SortType.DEFAULT;
    const tripDays = [...new Set(trips.map((trip) => new Date(trip.startTime).toDateString()))];
    const days = isDefaultSorting ? tripDays : [true];

    days.forEach((day, index) => {
      const tripDayComponent = isDefaultSorting ? new DayView(day, index) : new DayView();
      const tripEventList = tripDayComponent.getElement().querySelector(`.trip-events__list`);

      trips
        .filter((trip) => isDefaultSorting ? new Date(trip.startTime).toDateString() === day : trip)
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

  _modeChangeHandler() {
    this._eventNewPresenter.destroy();
    Object.values(this._eventPresenter).forEach((presenter) => presenter.resetView());
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

  _renderLoading() {
    render(this._tripContainer, this._loadingComponent, RenderPosition.BEFOREEND);
  }
}
