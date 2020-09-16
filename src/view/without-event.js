import AbstractView from './abstract.js';

const createWithoutEventTemplate = () => {
  return (
    `<p class="trip-events__msg">Click New Event to create your first point</p>`
  );
};

export default class WithoutEvent extends AbstractView {
  getTemplate() {
    return createWithoutEventTemplate();
  }
}
