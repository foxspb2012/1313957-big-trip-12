import MenuView from "./view/site-menu.js";
import TripInfoView from './view/trip-info.js';
import TripCostView from './view/trip-cost.js';
import FilterView from './view/filter.js';
import SortView from './view/trip-sort.js';
import EventEditView from './view/event-edit.js';
import DaysListView from './view/trip-days-container.js';
import DayView from './view/trip-days.js';
import EventView from './view/trip-events-item.js';
import {trips, tripDays} from './mock/trip.js';
import {renderElement, RenderPosition} from './utils.js';

const bodyElement = document.querySelector(`.page-body`);
const tripMainElement = bodyElement.querySelector(`.trip-main`);
const tripMainControlsElement = tripMainElement.querySelector(`.trip-main__trip-controls`);
const tripEventsElement = bodyElement.querySelector(`.trip-events`);

const tripInfoElement = new TripInfoView(trips);
const tripDaysList = new DaysListView();

const renderEvent = (eventList, trip) => {
  const eventElement = new EventView(trip);
  const eventEditElement = new EventEditView(trip);

  const replaceCardToForm = () => {
    eventList.replaceChild(eventEditElement.getElement(), eventElement.getElement());
  };

  const replaceFormToCard = () => {
    eventList.replaceChild(eventElement.getElement(), eventEditElement.getElement());
  };

  eventElement.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, replaceCardToForm);

  eventEditElement.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, () => {
    replaceFormToCard();
  });

  eventEditElement.getElement().querySelector(`form`).addEventListener(`submit`, (evt) => {
    evt.preventDefault();
    replaceFormToCard();
  });

  renderElement(eventList, eventElement.getElement(), RenderPosition.BEFOREEND);
};

renderElement(tripInfoElement.getElement(), new TripCostView(trips).getElement(), RenderPosition.BEFOREEND);
renderElement(tripMainElement, tripInfoElement.getElement(), RenderPosition.AFTERBEGIN);
renderElement(tripMainControlsElement, new MenuView().getElement(), RenderPosition.AFTERBEGIN);
renderElement(tripMainControlsElement, new FilterView().getElement(), RenderPosition.BEFOREEND);
renderElement(tripEventsElement, new SortView().getElement(), RenderPosition.BEFOREEND);

tripDays
  .forEach((day, index) => {
    const tripDayElement = new DayView(day, index);
    const tripEventsList = tripDayElement.getElement().querySelector(`.trip-events__list`);

    renderElement(tripDaysList.getElement(), tripDayElement.getElement(), RenderPosition.BEFOREEND);

    trips
      .filter((trip) => new Date(trip.startTime).toDateString() === day)
      .forEach((trip) => renderEvent(tripEventsList, trip));
  });

renderElement(tripEventsElement, tripDaysList.getElement(), RenderPosition.BEFOREEND);
