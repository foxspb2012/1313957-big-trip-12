import AbstractView from './abstract.js';

const createTripDaysContainer = () => {
  return (
    `<ul class="trip-days"></ul>`
  );
};
export default class DayList extends AbstractView {
  getTemplate() {
    return createTripDaysContainer();
  }
}
