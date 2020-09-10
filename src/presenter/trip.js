import SortView from '../view/trip-sort.js';
import EventView from '../view/trip-events-item.js';
import EventEditView from '../view/event-edit.js';
import DayView from '../view/trip-days.js';
import DaysListView from '../view/trip-days-container.js';
import WithoutEvent from '../view/without-event.js';
import {render, RenderPosition, replace} from '../utils/render';

export default class Trip {
  constructor(tripContainer) {
    this._tripContainer = tripContainer;
    this._trips = null;
    this.tripDays = null;

    this._sortComponent = new SortView();
    this._dayListComponent = new DaysListView();
    this._noEventComponent = new WithoutEvent();
  }

  init(trips) {
    this._trips = trips.slice();
    this._tripDays = [...new Set(this._trips.map((trip) => new Date(trip.startTime).toDateString()))];

    if (this._trips.length === 0) {
      this._renderNoEvent();
    } else {
      this._renderSort();
      this._tripDays.forEach(this._renderDay.bind(this));
      this._renderDayList();
    }
  }

  _renderSort() {
    render(this._tripContainer, this._sortComponent, RenderPosition.BEFOREEND);
  }

  _renderDayList() {
    render(this._tripContainer, this._dayListComponent, RenderPosition.BEFOREEND);
  }

  _renderDay(day, index) {
    const tripDayComponent = new DayView(day, index);
    const tripEventList = tripDayComponent.getElement().querySelector(`.trip-events__list`);

    render(this._dayListComponent, tripDayComponent, RenderPosition.BEFOREEND);

    this._trips
      .filter((trip) => new Date(trip.startTime).toDateString() === day)
      .forEach((trip) => this._renderEvent(tripEventList, trip));
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

