import {createTripInfoTemplate} from "./view/trip-info.js";
import {createSiteMenuTemplate} from "./view/site-menu.js";
import {createFilterTemplate} from "./view/filter.js";
import {createTripSearchTemplate} from "./view/trip-search.js";
import {createStatisticsTemplate} from "./view/statistics.js";
import {createSortTemplate} from "./view/sort.js";
import {createTripDaysContainer} from "./view/trip-days-container.js";
import {createTripDaysItem} from "./view/trip-days-item.js";
import {createTripEventsItem} from "./view/trip.js";
import {createEditTripEventsItem} from "./view/trip-edit.js";

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const tripMain = document.querySelector(`.trip-main`);
const tripControls = tripMain.querySelector(`.trip-controls`);
const pageMain = document.querySelector(`.page-main`);
const tripEvents = pageMain.querySelector(`.trip-events`);
const pageBodyContainer = pageMain.querySelector(`.page-body__container`);

render(tripMain, createTripInfoTemplate(), `afterbegin`);
render(tripControls.children[0], createSiteMenuTemplate(), `afterend`);
render(tripControls.children[2], createFilterTemplate(), `afterend`);
render(tripMain, createTripSearchTemplate(), `afterend`)
render(pageBodyContainer, createStatisticsTemplate(), `beforeend`);
render(tripEvents.children[0], createSortTemplate(), `afterend`);
render(tripEvents.children[1], createTripDaysContainer(), `afterend`);
const tripDaysContainer = document.querySelector(".trip-days");
render(tripDaysContainer, createTripDaysItem(), `afterbegin`);
const tripDaysItem = tripDaysContainer.querySelector(".trip-days__item");
const tripEventsList = tripDaysItem.querySelector(".trip-events__list");
render(tripEventsList, createTripEventsItem(), `afterbegin`);
render(tripEventsList, createEditTripEventsItem(), `afterbegin`);
