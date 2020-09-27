import MenuView from './view/menu.js';
import StatsView from './view/stats.js';
import TripPresenter from './presenter/trip.js';
import FilterPresenter from './presenter/filter.js';
import InfoPresenter from './presenter/info.js';
import EventsModel from './model/events.js';
import FilterModel from './model/filter.js';
import {MenuItem, UpdateType} from './const.js';
import {render, RenderPosition, remove} from './utils/render.js';
import Api from './api.js';

const AUTHORIZATION = `Basic vytyhfdbnczghjuhfvvhjdfybt`;
const END_POINT = `https://12.ecmascript.pages.academy/big-trip`;

const bodyElement = document.querySelector(`.page-body`);
const tripMainElement = bodyElement.querySelector(`.trip-main`);
const tripMainControlsElement = tripMainElement.querySelector(`.trip-main__trip-controls`);
const tripEventsElement = bodyElement.querySelector(`.trip-events`);

const menuComponent = new MenuView();
const eventsModel = new EventsModel();
const filterModel = new FilterModel();

const api = new Api(END_POINT, AUTHORIZATION);

const tripPresenter = new TripPresenter(tripEventsElement, eventsModel, filterModel, api);
const filterPresenter = new FilterPresenter(tripMainControlsElement, filterModel, eventsModel);
const infoPresenter = new InfoPresenter(tripMainElement, eventsModel);

render(tripMainControlsElement, menuComponent, RenderPosition.AFTERBEGIN);

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

filterPresenter.init();
tripPresenter.init();

document.querySelector(`.trip-main__event-add-btn`).addEventListener(`click`, (evt) => {
  evt.preventDefault();
  tripPresenter.createEvent();
});

api.getAllData()
  .then((events) => {
    eventsModel.setEvents(UpdateType.INIT, events);
    infoPresenter.init();
  })
  .catch(() => {
    eventsModel.setEvents(UpdateType.INIT, []);
  });
