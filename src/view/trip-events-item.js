import AbstractView from './abstract.js';
import {getFormatNumber, getFormatTime} from '../utils/common.js';
import {typesTransfer, typesActivity} from '../const.js';

const getTripDuration = (start, end) => {
  const durationInMinutes = (end - start) / (1000 * 60);
  const minutes = Math.floor(getFormatNumber(durationInMinutes % 60));
  if (durationInMinutes > 1440) {
    const days = getFormatNumber(Math.floor(durationInMinutes / (1440)));
    const hours = getFormatNumber(Math.floor((durationInMinutes % 1440) / 60));
    return `${days}D ${hours}H ${minutes}m`;
  } else if (durationInMinutes > 60) {
    const hours = getFormatNumber(Math.floor(durationInMinutes / 60));
    return `${hours}H ${minutes}m`;
  }
  return `${minutes}m`;
};

const createOffer = (offer) => {
  const {title, price} = offer;
  return (
    `<li class="event__offer">
      <span class="event__offer-title">${title}</span>
      &plus;
      &euro;&nbsp;<span class="event__offer-price">${price}</span>
    </li>`
  );
};

const preposition = Object.assign(typesTransfer, typesActivity);

const createTripEventsItemTemplate = (trip) => {
  const {type, destination, startTime, endTime, price, offers} = trip;
  const prep = preposition[type];
  const formattedStartTime = getFormatTime(startTime);
  const formattedEndTime = getFormatTime(endTime);
  const duration = getTripDuration(startTime, endTime);
  const offersElement = offers.map((it) => createOffer(it)).join(``);

  return (
    `<li class="trip-events__item">
      <div class="event">
        <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src="img/icons/${type.toLowerCase()}.png" alt="Event type icon">
        </div>
        <h3 class="event__title">${type} ${prep} ${destination}</h3>

        <div class="event__schedule">
          <p class="event__time">
            <time class="event__start-time" datetime="2019-03-18T10:30">${formattedStartTime}</time>
            &mdash;
            <time class="event__end-time" datetime="2019-03-18T11:00">${formattedEndTime}</time>
          </p>
          <p class="event__duration">${duration}</p>
        </div>

        <p class="event__price">
          &euro;&nbsp;<span class="event__price-value">${price}</span>
        </p>

        <h4 class="visually-hidden">Offers:</h4>
        <ul class="event__selected-offers">
          ${offersElement}
        </ul>

        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </div>
    </li>`
  );
};

export default class Event extends AbstractView {
  constructor(trip) {
    super();
    this._trip = trip;
    this._clickHandler = this._clickHandler.bind(this);
  }

  getTemplate() {
    return createTripEventsItemTemplate(this._trip);
  }

  _clickHandler(evt) {
    evt.preventDefault();
    this._callback.click();
  }

  setClickHandler(callback) {
    this._callback.click = callback;
    this.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, this._clickHandler);
  }
}
