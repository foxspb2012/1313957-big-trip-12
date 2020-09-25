import MenuView from "./view/site-menu.js";
import TripInfoView from './view/trip-info.js';
import TripCostView from './view/trip-cost.js';
import TripPresenter from './presenter/trip.js';
import {trips} from './mock/trip.js';
import FilterPresenter from './presenter/filter.js';
import EventsModel from './model/events.js';
import FilterModel from './model/filter.js';
import StatsView from './view/stats.js';
import {MenuItem} from './const.js';
import {render, RenderPosition, remove} from './utils/render.js';

const eventsModel = new EventsModel();
eventsModel.setEvents(trips);
const filterModel = new FilterModel();
const menuComponent = new MenuView();

const bodyElement = document.querySelector(`.page-body`);
const tripMainElement = bodyElement.querySelector(`.trip-main`);
const tripMainControlsElement = tripMainElement.querySelector(`.trip-main__trip-controls`);
const tripEventsElement = bodyElement.querySelector(`.trip-events`);

const tripInfoComponent = new TripInfoView(eventsModel.getEvents());
const tripPresenter = new TripPresenter(tripEventsElement, eventsModel, filterModel);
const filterPresenter = new FilterPresenter(tripMainControlsElement, filterModel, eventsModel);

render(tripInfoComponent, new TripCostView(eventsModel.getEvents()), RenderPosition.BEFOREEND);
render(tripMainElement, tripInfoComponent, RenderPosition.AFTERBEGIN);
render(tripMainControlsElement, menuComponent, RenderPosition.AFTERBEGIN);

document.querySelector(`.trip-main__event-add-btn`).addEventListener(`click`, (evt) => {
  evt.preventDefault();
  tripPresenter.createEvent();
});

let statsComponent = null;

const menuClickHandler = (menuItem) => {
  switch (menuItem) {
    case MenuItem.TABLE:
      remove(statsComponent);
      tripPresenter.init();
      break;
    case MenuItem.STATS:
      tripPresenter.destroy();
      statsComponent = new StatsView(eventsModel.getEvents());
      render(tripEventsElement, statsComponent, RenderPosition.BEFOREEND);
      break;
  }
};

menuComponent.setMenuClickHandler(menuClickHandler);

tripPresenter.init(trips);
filterPresenter.init();
