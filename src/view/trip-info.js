import AbstractView from './abstract.js';
import {getFormatDate} from '../utils/common.js';

export const createTripInfoTemplate = (trips) => {
  const firstPoint = trips ? trips[0] : ``;
  const lastPoint = trips ? trips[trips.length - 1] : ``;
  const dates = trips ? `${getFormatDate(firstPoint.startTime)}&nbsp;&mdash;&nbsp;${getFormatDate(lastPoint.startTime)}` : ``;
  const uniquePoint = trips ? [...new Set(trips.map((trip) => trip.destination.name))] : ``;
  let title = ``;
  if (trips) {
    title = (uniquePoint.length > 3) ? `${firstPoint.destination.name} &mdash;...&mdash; ${lastPoint.destination.name}` : uniquePoint.join(`-`);
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
