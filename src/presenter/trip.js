import SortView from '../view/trip-sort.js';
import EventView from '../view/trip-events-item.js';
import EventEditView from '../view/event-edit.js';
import DayView from '../view/trip-days.js';
import DaysListView from '../view/trip-days-container.js';
import WithoutEvent from '../view/without-event.js';
import {render, RenderPosition, replace} from '../utils/render';
import {sortByPrice, sortByTime} from '../utils/common.js';
import {SortType} from '../const.js';

export default class Trip {
  constructor(tripContainer) {
    this._tripContainer = tripContainer;
    this._trips = null;
    this._tripDays = null;

    this._sortComponent = new SortView();
    this._dayListComponent = new DaysListView();
    this._noEventComponent = new WithoutEvent();
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
  }

  init(trips) {
    this._trips = trips.slice();
    this._tripDays = [...new Set(this._trips.map((trip) => new Date(trip.startTime).toDateString()))];

    if (this._trips.length === 0) {
      this._renderNoEvent();
    } else {
      this._renderSort();
      this._renderEvents();
    }
  }

  _renderEvents(trips = this._trips, isSortDefault = true) {
    this._dayListComponent.getElement().innerHTML = ``;

    const days = isSortDefault ? this._tripDays : [true];
    days.forEach((day, index) => {
      const tripDayComponent = isSortDefault ? new DayView(day, index) : new DayView();
      const tripEventList = tripDayComponent.getElement().querySelector(`.trip-events__list`);

      trips
        .filter((trip) => isSortDefault ? new Date(trip.startTime).toDateString() === day : trip)
        .forEach((trip) => this._renderEvent(tripEventList, trip));

      render(this._dayListComponent, tripDayComponent, RenderPosition.BEFOREEND);
    });

    render(this._tripContainer, this._dayListComponent, RenderPosition.BEFOREEND);
  }

  _renderSort() {
    this._sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
    render(this._tripContainer, this._sortComponent, RenderPosition.BEFOREEND);
  }

  _handleSortTypeChange(sortType) {
    const trips = this._trips.slice();
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

  _renderEvent(eventList, trip) {
    const eventComponent = new EventView(trip);
    const eventEditComponent = new EventEditView(trip);

    const replaceCardToForm = () => {
      replace(eventEditComponent, eventComponent);
    };

    const replaceFormToCard = () => {
      replace(eventComponent, eventEditComponent);
      document.removeEventListener(`keydown`, onEscKeyDown);
    };

    const onEscKeyDown = (evt) => {
      if (evt.key === `Escape` || evt.key === `Esc`) {
        evt.preventDefault();
        replaceFormToCard();
      }
    };

    eventComponent.setClickHandler(() => {
      replaceCardToForm();
      document.addEventListener(`keydown`, onEscKeyDown);
    });

    eventEditComponent.setFormSubmitHandler(() => {
      replaceFormToCard();
    });

    render(eventList, eventComponent, RenderPosition.BEFOREEND);
  }

  _renderWithoutEvent() {
    render(this._tripContainer, new WithoutEvent(), RenderPosition.BEFOREEND);
  }
}

