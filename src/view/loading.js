import Abstract from './abstract.js';

const createNoEventsElement = () => {
  return (
    `<p class="trip-events__msg">Loading...</p>`
  );
};

export default class Loading extends Abstract {
  getTemplate() {
    return createNoEventsElement();
  }
}
