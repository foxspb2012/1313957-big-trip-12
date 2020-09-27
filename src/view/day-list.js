import AbstractView from './abstract.js';

const createTripDaysTemplate = () => (
  `<ul class="trip-days"></ul>`
);

export default class DayList extends AbstractView {
  getTemplate() {
    return createTripDaysTemplate();
  }
}
