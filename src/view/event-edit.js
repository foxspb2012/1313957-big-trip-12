import SmartView from './smart.js';
import {getFormatEditTime, getFormatText} from '../utils/common.js';
import {Preposition, datePickerOptions, EventEditMode, types, activityStartIndex} from '../const.js';
import he from 'he';
import flatpickr from 'flatpickr';
import StoreModel from '../model/store.js';

import '../../node_modules/flatpickr/dist/flatpickr.min.css';

const createOffer = (offer, checkedOffers, isDisabled) => {
  const {title, price} = offer;
  const isChecked = checkedOffers.some((checkedOffer) => checkedOffer.title.toUpperCase() === title.toUpperCase());

  return (
    `<div class="event__offer-selector">
      <input class="event__offer-checkbox  visually-hidden" id="event-offer-${getFormatText(title)}" type="checkbox" name="event-offer-${getFormatText(title)}" ${isChecked ? `checked` : ``} ${isDisabled ? `disabled` : ``}>
      <label class="event__offer-label" for="event-offer-${getFormatText(title)}">
        <span class="event__offer-title">${title}</span>
        &plus;
        &euro;&nbsp;<span class="event__offer-price">${price}</span>
      </label>
    </div>`
  );
};

const createPhoto = (src, description) => `<img class="event__photo" src="${src}" alt="${description}">`;

const createDestinationOption = (destination) => {
  return (
    `<option value="${destination.name}"></option>`
  );
};

const createTypeElement = (type, tripType) => {
  return (
    `<div class="event__type-item">
      <input id="event-type-${type}" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type}" ${type === tripType.toLowerCase() ? `checked` : ``}>
      <label class="event__type-label  event__type-label--${type}" for="event-type-${type}">${type[0].toUpperCase() + type.slice(1)}</label>
    </div>`
  );
};

const createEventEditTemplate = (trip, mode, destinations, availableOffers) => {
  const {price, startTime, endTime, isFavorite, offers, destination, isDisabled, isSaving, isDeleting} = trip;
  let {type} = trip;
  type = type[0].toUpperCase() + type.slice(1);
  const prep = Preposition[type.toUpperCase()];
  const formattedStartTime = getFormatEditTime(startTime);
  const formattedEndTime = getFormatEditTime(endTime);
  const offersElement = availableOffers[type.toLowerCase()].map((it) => createOffer(it, offers, isDisabled)).join(``);
  const picturesElement = destination.pictures.map(({src, description}) => createPhoto(src, description)).join(``);
  const destinationOptionsElement = destinations.map((dest) => createDestinationOption(dest)).join(``);
  const deleteButtonText = isDeleting ? `Deleting...` : `Delete`;
  const typeGroupTransfer = types.slice(0, activityStartIndex).map((it) => createTypeElement(it, type)).join(``);
  const typeGroupActivity = types.slice(activityStartIndex).map((it) => createTypeElement(it, type)).join(``);

  return (
    `${mode === EventEditMode.EDIT_EVENT ? `<li class="trip-events__item">` : `<div>`}
      <form class="${mode === EventEditMode.ADD_EVENT ? `trip-events__item` : ``} event  event--edit" action="#" method="post">
        <header class="event__header">
          <div class="event__type-wrapper">
            <label class="event__type  event__type-btn" for="event-type-toggle-1">
              <span class="visually-hidden">Choose event type</span>
              <img class="event__type-icon" width="17" height="17" src="img/icons/${type.toLowerCase()}.png" alt="Event type icon">
            </label>
            <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox" ${isDisabled ? `disabled` : ``}>

            <div class="event__type-list">
              <fieldset class="event__type-group">
                <legend class="visually-hidden">Transfer</legend>
                ${typeGroupTransfer}
              </fieldset>

              <fieldset class="event__type-group">
                <legend class="visually-hidden">Activity</legend>
                ${typeGroupActivity}
              </fieldset>
            </div>
          </div>

          <div class="event__field-group  event__field-group--destination">
            <label class="event__label  event__type-output" for="event-destination-1">
              ${type} ${prep}
            </label>
            <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${he.encode(destination.name)}" list="destination-list-1" ${isDisabled ? `disabled` : ``} required>
            <datalist id="destination-list-1">
              ${destinationOptionsElement}
            </datalist>
          </div>

          <div class="event__field-group  event__field-group--time">
            <label class="visually-hidden" for="event-start-time-1">
              From
            </label>
            <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${formattedStartTime}" ${isDisabled ? `disabled` : ``}>
            &mdash;
            <label class="visually-hidden" for="event-end-time-1">
              To
            </label>
            <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${formattedEndTime}" ${isDisabled ? `disabled` : ``}>
          </div>

          <div class="event__field-group  event__field-group--price">
            <label class="event__label" for="event-price-1">
              <span class="visually-hidden">Price</span>
              &euro;
            </label>
            <input class="event__input  event__input--price" id="event-price-1" type="number" name="event-price" value="${price}" ${isDisabled ? `disabled` : ``}>
          </div>

          <button
            class="event__save-btn  btn  btn--blue"
            type="submit"
            ${isDisabled ? `disabled` : ``}>
            ${isSaving ? `Saving...` : `Save`}
          </button>
          <button
            class="event__reset-btn"
            type="reset"
            ${isDisabled ? `disabled` : ``}>
            ${mode === EventEditMode.ADD_EVENT ? `Cancel` : deleteButtonText}
          </button>

          ${mode === EventEditMode.ADD_EVENT ? `` : `<input id="event-favorite-1" class="event__favorite-checkbox  visually-hidden" type="checkbox" name="event-favorite" ${isFavorite ? `checked` : ``} ${isDisabled ? `disabled` : ``}>
            <label class="event__favorite-btn" for="event-favorite-1">
              <span class="visually-hidden">Add to favorite</span>
              <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
                <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
              </svg>
            </label>`}

          ${mode === EventEditMode.ADD_EVENT ? `` : `<button class="event__rollup-btn" type="button" ${isDisabled ? `disabled` : ``}>
            <span class="visually-hidden">Open event</span>
          </button>`}
        </header>

        <section class="event__details">
          ${availableOffers[type.toLowerCase()].length ? `<section class="event__section  event__section--offers">
            <h3 class="event__section-title  event__section-title--offers">Offers</h3>

            <div class="event__available-offers">
              ${offersElement}
            </div>
          </section>` : ``}

          ${destination.name ? `<section class="event__section  event__section--destination">
            <h3 class="event__section-title  event__section-title--destination">${he.encode(destination.name)}</h3>
            <p class="event__destination-description">${destination.description}</p>

            <div class="event__photos-container">
              <div class="event__photos-tape">
                ${picturesElement}
              </div>
            </div>
          </section>` : ``}
        </section>
      </form>
    ${mode === EventEditMode.EDIT_EVENT ? `</li>` : `</div>`}`
  );
};

export default class EventEdit extends SmartView {
  constructor(trip, mode) {
    super();
    this._trip = trip;
    this._mode = mode;
    this._availableOffers = {};

    StoreModel.getOffers().forEach((it) => {
      this._availableOffers[it.type] = it.offers;
    });

    this._destinations = StoreModel.getDestinations();
    this._datepicker = null;
    this._clickHandler = this._clickHandler.bind(this);
    this._formSubmitHandler = this._formSubmitHandler.bind(this);
    this._formDeleteClickHandler = this._formDeleteClickHandler.bind(this);
    this._favoriteChangeHandler = this._favoriteChangeHandler.bind(this);
    this._typeChangeHandler = this._typeChangeHandler.bind(this);
    this._destinationChangeHandler = this._destinationChangeHandler.bind(this);
    this._priceChangeHandler = this._priceChangeHandler.bind(this);
    this._startTimeChangeHandler = this._startTimeChangeHandler.bind(this);
    this._endTimeChangeHandler = this._endTimeChangeHandler.bind(this);
    this._offersChangeHandler = this._offersChangeHandler.bind(this);
    this._setInnerHandlers();
    this._setDatePickers();
  }

  getTemplate() {
    return createEventEditTemplate(this._trip, this._mode, this._destinations, this._availableOffers);
  }

  restoreHandlers() {
    this._setInnerHandlers();
    this._setDatePickers();
    this.setFormSubmitHandler(this._callback.formSubmit);
    this.setDeleteClickHandler(this._callback.deleteClick);
    this.setClickHandler(this._callback.click);
  }

  setDeleteClickHandler(callback) {
    this._callback.deleteClick = callback;
    this.getElement().querySelector(`.event__reset-btn`).addEventListener(`click`, this._formDeleteClickHandler);
  }

  setFormSubmitHandler(callback) {
    this._callback.formSubmit = callback;
    this.getElement().querySelector(`form`).addEventListener(`submit`, this._formSubmitHandler);
  }

  setClickHandler(callback) {
    if (this._mode === EventEditMode.EDIT_EVENT) {
      this._callback.click = callback;
      this.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, this._clickHandler);
    }
  }

  reset(event) {
    this.updateData(event);
  }

  _setInnerHandlers() {
    if (this._mode !== EventEditMode.ADD_EVENT) {
      this.getElement().querySelector(`.event__favorite-checkbox`).addEventListener(`change`, this._favoriteChangeHandler);
    }
    this.getElement().querySelector(`.event__type-list`).addEventListener(`change`, this._typeChangeHandler);
    this.getElement().querySelector(`.event__input--destination`).addEventListener(`change`, this._destinationChangeHandler);
    this.getElement().querySelector(`.event__input--price`).addEventListener(`change`, this._priceChangeHandler);
    if (this.getElement().querySelector(`.event__available-offers`)) {
      this.getElement().querySelector(`.event__available-offers`).addEventListener(`change`, this._offersChangeHandler);
    }
  }

  _setDatePickers() {
    if (this._startDatepicker) {
      this._startDatepicker.destroy();
      this._startDatepicker = null;
    }

    if (this._endDatepicker) {
      this._endDatepicker.destroy();
      this._endDatepicker = null;
    }

    this._startDatepicker = flatpickr(this.getElement().querySelector(`input[name="event-start-time"]`), Object.assign({}, datePickerOptions, {defaultDate: this._trip.startTime, onClose: this._startTimeChangeHandler}));
    this._endDatepicker = flatpickr(this.getElement().querySelector(`input[name="event-end-time"]`), Object.assign({}, datePickerOptions, {defaultDate: this._trip.endTime, onClose: this._endTimeChangeHandler}));
  }

  _formDeleteClickHandler(evt) {
    evt.preventDefault();
    this._callback.deleteClick(this._trip);
  }

  _formSubmitHandler(evt) {
    evt.preventDefault();
    this._callback.formSubmit(this._trip);
  }

  _favoriteChangeHandler(evt) {
    evt.preventDefault();
    this.updateData({isFavorite: !this._trip.isFavorite});
  }

  _typeChangeHandler(evt) {
    evt.preventDefault();
    this.updateData({type: evt.target.value.toLowerCase(), offers: []});
  }

  _destinationChangeHandler(evt) {
    evt.preventDefault();
    this.updateData({destination: this._destinations.filter((dest) => dest.name === evt.target.value)[0]});
  }

  _priceChangeHandler(evt) {
    evt.preventDefault();
    this.updateData({price: evt.target.value}, true);
  }

  _offersChangeHandler(evt) {
    evt.preventDefault();
    const title = this.getElement().querySelector(`label[for="${evt.target.name}"] .event__offer-title`).textContent;
    this.updateData({offers: !evt.target.checked ?
      [...this._trip.offers.filter((offer) => offer.title !== title)] :
      [...this._trip.offers, ...this._availableOffers[this._trip.type.toLowerCase()].filter((offer) => offer.title === title)]});
  }

  _clickHandler(evt) {
    evt.preventDefault();
    this._callback.click();
  }

  _startTimeChangeHandler([userDate]) {
    this.updateData({startTime: userDate});
  }

  _endTimeChangeHandler([userDate]) {
    this.updateData({endTime: userDate});
  }
}
