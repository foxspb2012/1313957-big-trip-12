import {createElement} from '../utils.js';

const getTripCost = (trips) => trips.reduce((accumulator, currentValue) =>
  accumulator + currentValue.price + currentValue.offers.reduce((acc, curValue) => acc + curValue.price, 0), 0);

const createTripCostTemplate = (trips) => {
  const cost = getTripCost(trips);

  return (
    `<p class="trip-info__cost">
      Total: &euro;&nbsp;<span class="trip-info__cost-value">${cost}</span>
    </p>`
  );
};

export default class TripCost {
  constructor(trips) {
    this._trips = trips;
    this._element = null;
  }

  getTemplate() {
    return createTripCostTemplate(this._trips);
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
