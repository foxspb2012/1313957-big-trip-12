import MenuView from "./view/site-menu.js";
import TripInfoView from './view/trip-info.js';
import TripCostView from './view/trip-cost.js';
import TripPresenter from './presenter/trip.js';
import {trips} from './mock/trip.js';
import {render, RenderPosition} from './utils/render.js';
import FilterPresenter from './presenter/filter.js';
import EventsModel from './model/events.js';
import FilterModel from './model/filter.js';

const eventsModel = new EventsModel();
eventsModel.setEvents(trips);
const filterModel = new FilterModel();

const bodyElement = document.querySelector(`.page-body`);
const tripMainElement = bodyElement.querySelector(`.trip-main`);
const tripMainControlsElement = tripMainElement.querySelector(`.trip-main__trip-controls`);
const tripEventsElement = bodyElement.querySelector(`.trip-events`);

const tripInfoComponent = new TripInfoView(eventsModel.getEvents());
const tripPresenter = new TripPresenter(tripEventsElement, eventsModel, filterModel);
const filterPresenter = new FilterPresenter(tripMainControlsElement, filterModel, eventsModel);

render(tripInfoComponent, new TripCostView(eventsModel.getEvents()), RenderPosition.BEFOREEND);
render(tripMainElement, tripInfoComponent, RenderPosition.AFTERBEGIN);
render(tripMainControlsElement, new MenuView(), RenderPosition.AFTERBEGIN);

document.querySelector(`.trip-main__event-add-btn`).addEventListener(`click`, (evt) => {
  evt.preventDefault();
  tripPresenter.createEvent();
});

tripPresenter.init(trips);
filterPresenter.init();
