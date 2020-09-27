import AbstractView from './abstract.js';
import {getFormatDate} from '../utils/common.js';

const createTripInfoTemplate = (trips) => {
  const firstLocation = trips ? trips[0] : ``;
  const lastLocation = trips ? trips[trips.length - 1] : ``;

  const dates = trips ? `${getFormatDate(firstLocation.startTime)}&nbsp;&mdash;&nbsp;${getFormatDate(lastLocation.startTime)}` : ``;
  const uniqueLocations = trips ? [...new Set(trips.map((trip) => trip.destination.name))] : ``;
  let title = ``;
  if (trips) {
    title = (uniqueLocations.length > 3) ? `${firstLocation.destination.name} &mdash;...&mdash; ${lastLocation.destination.name}` : uniqueLocations.join(`-`);
  }

  return (
    `<section class="trip-main__trip-info  trip-info">
      <div class="trip-info__main">
        <h1 class="trip-info__title">${title}</h1>

        <p class="trip-info__dates">${dates}</p>
      </div>
    </section>`
  );
};

export default class TripInfo extends AbstractView {
  constructor(trips) {
    super();
    this._trips = trips;
  }

  getTemplate() {
    return createTripInfoTemplate(this._trips);
  }
}
