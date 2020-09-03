import {getFormatDate} from '../utils.js';

export const createTripDaysItemTemplate = (day, index) => {
  const date = getFormatDate(day);

  return (
    `<li class="trip-days__item  day">
      <div class="day__info">
        <span class="day__counter">${index + 1}</span>
        <time class="day__date" datetime="2019-03-18">${date}</time>
      </div>
      <ul class="trip-events__list"></ul>
    </li>`
  );
};
