import MenuView from "./view/site-menu.js";
import TripInfoView from './view/trip-info.js';
import TripCostView from './view/trip-cost.js';
import TripPresenter from './presenter/trip.js';
import FilterPresenter from './presenter/filter.js';
import EventsModel from './model/events.js';
import FilterModel from './model/filter.js';
import StatsView from './view/stats.js';
import {MenuItem, UpdateType} from './const.js';
import {render, RenderPosition, remove} from './utils/render.js';
import Api from './api.js';

const AUTHORIZATION = `Basic vytyhfdbnczghjuhfvvhjdfybt`;
const END_POINT = `https://12.ecmascript.pages.academy/big-trip`;

const bodyElement = document.querySelector(`.page-body`);
const tripMainElement = bodyElement.querySelector(`.trip-main`);
const tripMainControlsElement = tripMainElement.querySelector(`.trip-main__trip-controls`);
const tripEventsElement = bodyElement.querySelector(`.trip-events`);

const eventsModel = new EventsModel();
const filterModel = new FilterModel();
const menuComponent = new MenuView();
const api = new Api(END_POINT, AUTHORIZATION);

const tripPresenter = new TripPresenter(tripEventsElement, eventsModel, filterModel, api);
const filterPresenter = new FilterPresenter(tripMainControlsElement, filterModel, eventsModel);

render(tripMainControlsElement, menuComponent, RenderPosition.AFTERBEGIN);

document.querySelector(`.trip-main__event-add-btn`).addEventListener(`click`, (evt) => {
  evt.preventDefault();
  tripPresenter.createEvent();
});

let statsComponent = null;

const menuClickHandler = (menuItem) => {
  switch (menuItem) {
    case MenuItem.TABLE:
      if (statsComponent) {
        remove(statsComponent);
      }
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

tripPresenter.init();
filterPresenter.init();

api.getEverything()
  .then((events) => {
    eventsModel.setEvents(UpdateType.INIT, events);
    const tripCostComponent = new TripCostView(eventsModel.getEvents());
    const tripInfoComponent = new TripInfoView(eventsModel.getEvents());
    render(tripInfoComponent, tripCostComponent, RenderPosition.BEFOREEND);
    render(tripMainElement, tripInfoComponent, RenderPosition.AFTERBEGIN);
  })
  .catch(() => {
    eventsModel.setEvents(UpdateType.INIT, []);
  });
