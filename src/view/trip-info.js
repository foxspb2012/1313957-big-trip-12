import AbstractView from './abstract.js';
import {getFormatDate} from '../utils/common.js';

export const createTripInfoTemplate = (trips) => {
  const firstPoint = trips[0];
  const lastPoint = trips[trips.length - 1];
  const dates = trips.length ? `${getFormatDate(firstPoint.startTime)}&nbsp;&mdash;&nbsp;${getFormatDate(lastPoint.startTime)}` : ``;
  const uniquePoint = [...new Set(trips.map((trip) => trip.destination))];
  const title = (uniquePoint.length > 3) ? `${firstPoint.destination} &mdash;...&mdash; ${lastPoint.destination}` : uniquePoint.join(`-`);

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
