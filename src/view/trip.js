import {MIN_COUNT_FOR_DATES} from "../const.js";
import {createElement} from "../utils.js";

const createOfferTemplate = (offers) => {
  return offers.slice(0, 3).map(({name, price}) =>
    `<li class="event__offer">
      <span class="event__offer-title">${name}</span>
      &plus;
      &euro;&nbsp;<span class="event__offer-price">${price}</span>
    </li>`)
    .join(``);
};

const durationTimeDisplay = (endDate, startDate) => {
  const duration = new Date(endDate).getTime() - new Date(startDate).getTime();
  const days = new Date(duration).getDate();
  const hours = new Date(duration).getHours();
  const minutes = new Date(duration).getMinutes();
  if (Math.floor(days) > 0 && Math.floor(hours) > 0) {
    return Math.floor(days) + `D ` + Math.floor(hours) + `H ` + Math.floor(minutes) + `M`;
  } else if (Math.floor(days) <= 0 && Math.floor(hours) > 0) {
    return Math.floor(hours) + `H ` + Math.floor(minutes) + `M`;
  } else if (Math.floor(days) <= 0 && Math.floor(hours) <= 0 && Math.floor(minutes) > 0) {
    return Math.floor(minutes) + `M`;
  } else {
    return ``;
  }
};

const generateStartDate = (date) => {
  const startYear = date.getFullYear();
  const startMonth = date.getMonth();
  const startDay = date.getDate();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  if (startMonth <= MIN_COUNT_FOR_DATES && minutes > MIN_COUNT_FOR_DATES) {
    return startYear + `-` + `0` + startMonth + `-` + startDay + `T` + hours + `:` + minutes;
  } else if (startMonth <= MIN_COUNT_FOR_DATES && minutes <= MIN_COUNT_FOR_DATES) {
    return startYear + `-` + `0` + startMonth + `-` + startDay + `T` + hours + `:` + `0` + minutes;
  } else if (startMonth > MIN_COUNT_FOR_DATES && minutes <= MIN_COUNT_FOR_DATES) {
    return startYear + `-` + startMonth + `-` + startDay + `T` + hours + `:` + `0` + minutes;
  } else {
    return startYear + `-` + startMonth + `-` + startDay + `T` + hours + `:` + minutes;
  }
};

const generateEndDate = (date) => {
  const endYear = date.getFullYear();
  const endMonth = date.getMonth();
  const endDay = date.getDate() < 21 ? date.getDate() + Math.floor(Math.random() * 10) : date.getDate() + Math.floor(Math.random() * 5);
  const hours = date.getHours();
  const minutes = date.getMinutes();
  if (endMonth <= MIN_COUNT_FOR_DATES && minutes > MIN_COUNT_FOR_DATES) {
    return endYear + `-` + `0` + endMonth + `-` + endDay + `T` + hours + `:` + minutes;
  } else if (endMonth <= MIN_COUNT_FOR_DATES && minutes <= MIN_COUNT_FOR_DATES) {
    return endYear + `-` + `0` + endMonth + `-` + endDay + `T` + hours + `:` + `0` + minutes;
  } else if (endMonth > MIN_COUNT_FOR_DATES && minutes <= MIN_COUNT_FOR_DATES) {
    return endYear + `-` + endMonth + `-` + endDay + `T` + hours + `:` + `0` + minutes;
  } else {
    return endYear + `-` + endMonth + `-` + endDay + `T` + hours + `:` + minutes;
  }
};

const generateTime = (date) => {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  if (minutes <= MIN_COUNT_FOR_DATES) {
    return hours + `:` + `0` + minutes;
  } else {
    return hours + `:` + minutes;
  }
};

const createEventTemplate = (event) => {
  const {type, city, price, offers, startDate, endDate} = event;
  let eventTypeArticle = ``;
  switch (type) {
    case `Taxi`:
    case `Bus`:
    case `Train`:
    case `Ship`:
    case `Transport`:
    case `Drive`:
    case `Flight`:
      eventTypeArticle = `to`;
      break;
    case `Check-in`:
    case `Sightseeing`:
    case `Restaurant`:
      eventTypeArticle = `in`;
      break;
  }

  const randomStartDate = generateStartDate(startDate);
  const randomEndDate = generateEndDate(startDate);
  const randomStartTime = generateTime(startDate);
  const randomEndTime = generateTime(endDate);
  const durationTimeTemplate = durationTimeDisplay(endDate, startDate);
  const offerTemplate = createOfferTemplate(offers);
  return (
    `<li class="trip-events__item">
      <div class="event">
        <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src="img/icons/${type.toLowerCase()}.png" alt="Event type icon">
        </div>
        <h3 class="event__title">${type} ${eventTypeArticle} ${city}</h3>

        <div class="event__schedule">
          <p class="event__time">
            <time class="event__start-time" datetime="${randomStartDate}">${randomStartTime}</time>
            &mdash;
            <time class="event__end-time" datetime="${randomEndDate}">${randomEndTime}</time>
          </p>
          <p class="event__duration">${durationTimeTemplate}</p>
        </div>

        <p class="event__price">
          &euro;&nbsp;<span class="event__price-value">${price}</span>
        </p>

        <h4 class="visually-hidden">Offers:</h4>
        <ul class="event__selected-offers">
          ${offerTemplate}
        </ul>

        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </div>
    </li>`
  );
};

export default class Event {
  constructor(event) {
    this._event = event;
    this._element = null;
  }
  getTemplate() {
    return createEventTemplate(this._event);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }
    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
