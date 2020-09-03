import {createSiteMenuTemplate} from "./view/site-menu.js";
import {createTripInfoTemplate} from './view/trip-info.js';
import {createTripCostTemplate} from './view/trip-cost.js';
import {createFilterTemplate} from './view/filter.js';
import {createTripSortTemplate} from './view/trip-sort.js';
import {createEventEditTemplate} from './view/event-edit.js';
import {createTripDaysContainer} from './view/trip-days-container.js';
import {createTripDaysItemTemplate} from './view/trip-days.js';
import {createTripEventsItemTemplate} from './view/trip-events-item.js';
import {createTrip} from './mock/trip.js';
import {render} from "./utils.js";

const EVENTS_COUNT = 20;
const trips = new Array(EVENTS_COUNT).fill().map(createTrip).sort((a, b) => a.startTime - b.startTime);
const tripDays = [...new Set(trips.map((trip) => new Date(trip.startTime).toDateString()))];

const bodyElement = document.querySelector(`.page-body`);
const tripMainElement = bodyElement.querySelector(`.trip-main`);
const tripMainControlsElement = tripMainElement.querySelector(`.trip-main__trip-controls`);
const menuHeaderElement = tripMainControlsElement.querySelector(`h2`);
const tripEventsElement = bodyElement.querySelector(`.trip-events`);

render(tripMainElement, createTripInfoTemplate(trips), `afterbegin`);

const tripMainInfoElement = tripMainElement.querySelector(`.trip-main__trip-info`);

render(tripMainInfoElement, createTripCostTemplate(trips), `beforeend`);
render(menuHeaderElement, createSiteMenuTemplate(), `afterend`);
render(tripMainControlsElement, createFilterTemplate(), `beforeend`);
render(tripEventsElement, createTripSortTemplate(), `beforeend`);
render(tripEventsElement, createTripDaysContainer(), `beforeend`);

const tripDaysElement = tripEventsElement.querySelector(`.trip-days`);

tripDays.forEach((day, index) => {
  render(tripDaysElement, createTripDaysItemTemplate(day, index), `beforeend`);

  const tripDayElement = tripDaysElement.querySelector(`.trip-days__item:last-child`);
  const tripEventsListElement = tripDayElement.querySelector(`.trip-events__list`);

  trips.filter((trip) => new Date(trip.startTime).toDateString() === day)
    .forEach((trip) => render(tripEventsListElement, createTripEventsItemTemplate(trip), `beforeend`));
});

const tripEventsListElement = tripDaysElement.querySelector(`.trip-events__list`);
render(tripEventsListElement, createEventEditTemplate(trips[0]), `afterbegin`);


/* import TripInfoView from "./view/trip-info.js";

import FilterView from "./view/filter.js";
import SortView from "./view/sort.js";
import EventListView from "./view/events-list.js";
import TripEditView from "./view/event-edit.js";
import TripView from "./view/trip.js";
import {generateEvent} from "./mock/trip.js";
import {render} from "./utils.js";

const EVENTS_COUNT = 20;

export const events = new Array(EVENTS_COUNT).fill().map(generateEvent).sort((a, b) => {
  return a.startDate - b.startDate;
});

 const arrayFromEvents = [];

const counter = {
  date: ``,
  month: ``,
  year: ``
};

for (let i = 0; i < events.length; i++) {
  if (events[i].startDate.getFullYear() === counter.year
    && events[i].startDate.getMonth() === counter.month
    && events[i].startDate.getDate() === counter.date) {
    arrayFromEvents[arrayFromEvents.length - 1].points.push(events[i]);
  } else {
    counter.date = events[i].startDate.getDate();
    counter.month = events[i].startDate.getMonth();
    counter.year = events[i].startDate.getFullYear();
    arrayFromEvents.push(Object({
      year: events[i].startDate.getFullYear(),
      month: events[i].startDate.getMonth(),
      date: events[i].startDate.getDate(),
      points: [events[i]]
    }));
  }
}

export const renderEvent = (eventListElement, event) => {
  const eventComponent = new TripView(event);
  const eventEditComponent = new TripEditView(event);

  const replaceEventToForm = () => {
    eventListElement.replaceChild(eventEditComponent.getElement(), eventComponent.getElement());
  };

  const replaceFormToEvent = () => {
    eventListElement.replaceChild(eventComponent.getElement(), eventEditComponent.getElement());
  };

  const onEscKeyDown = (evt) => {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      evt.preventDefault();
      replaceFormToEvent();
      document.removeEventListener(`keydown`, onEscKeyDown);
    }
  };

  const closeEventEdit = () => {
    const openedEventEdit = document.querySelector(`.opened`);
    if (openedEventEdit) {
      replaceFormToEvent();
      document.removeEventListener(`keydown`, onEscKeyDown);
    }
  };

  eventComponent.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, () => {
    closeEventEdit();
    replaceEventToForm();
    document.addEventListener(`keydown`, onEscKeyDown);
  });

  eventEditComponent.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, () => {
    replaceFormToEvent();
    document.removeEventListener(`keydown`, onEscKeyDown);
  });

  eventEditComponent.getElement().querySelector(`form`).addEventListener(`submit`, (evt) => {
    evt.preventDefault();
    replaceFormToEvent();
    document.removeEventListener(`keydown`, onEscKeyDown);
  });

  render(eventListElement, eventComponent.getElement(), `beforeend`);
};

const mainHeaderElement = document.querySelector(`.trip-main`);
const menuAndFilterElement = mainHeaderElement.querySelector(`.trip-main__trip-controls`);

render(mainHeaderElement, new TripInfoView(events).getElement(), `afterbegin`);
render(menuAndFilterElement, new MenuView().getElement(), `beforeend`);
render(menuAndFilterElement, new FilterView().getElement(), `beforeend`);

const pageMainElement = document.querySelector(`.page-body__page-main`);
const tripEventsElements = pageMainElement.querySelector(`.trip-events`);

render(tripEventsElements, new SortView().getElement(), `beforeend`);
render(tripEventsElements, new EventListView(events).getElement(), `beforeend`);

const eventListElements = pageMainElement.querySelectorAll(`.trip-events__list`);

Array.from(eventListElements).forEach((eventListElement, index) => {
  for (let i = 0; i < events[index].points.length; i++) {
    renderEvent(eventListElement, events[index].points[i]);
  }
});
*/
