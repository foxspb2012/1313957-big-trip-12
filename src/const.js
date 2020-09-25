import {getRandomInteger} from './utils/common.js';

export const typesTransfer = {
  'Taxi': `to`,
  'Bus': `to`,
  'Train': `to`,
  'Ship': `to`,
  'Transport': `to`,
  'Drive': `to`,
  'Flight': `to`,
};

export const typesActivity = {
  'Check-in': `in`,
  'Sightseeing': `in`,
  'Restaurant': `in`,
};

export const eventsDestinations = [
  `Amsterdam`,
  `Geneva`,
  `Chamonix`,
  `Saint Petersburg`,
];

export const eventDescriptions = [
  `Lorem ipsum dolor sit amet, consectetur adipiscing elit.`,
  `Cras aliquet varius magna, non porta ligula feugiat eget.`,
  `Fusce tristique felis at fermentum pharetra.`,
  `Aliquam id orci ut lectus varius viverra.`,
  `Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.`,
  `Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.`,
  `Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.`,
  `Sed sed nisi sed augue convallis suscipit in sed felis.`,
  `Aliquam erat volutpat.`,
  `Nunc fermentum tortor ac porta dapibus.`,
  `In rutrum ac purus sit amet tempus.`,
];

export const MIN_COUNT_FOR_DATES = 9;

export const offers = [
  {title: `Choose seats`, price: 40, isChecked: Boolean(getRandomInteger(0, 1))},
  {title: `Add meal`, price: 60, isChecked: Boolean(getRandomInteger(0, 1))},
  {title: `Travel by train`, price: 80, isChecked: Boolean(getRandomInteger(0, 1))},
  {title: `Switch to comfort class`, price: 90, isChecked: Boolean(getRandomInteger(0, 1))},
  {title: `Add luggage`, price: 50, isChecked: Boolean(getRandomInteger(0, 1))},
];

export const SortType = {
  DEFAULT: `event`,
  PRICE: `price`,
  TIME: `time`,
};

export const UserAction = {
  ADD_EVENT: `ADD_EVENT`,
  EDIT_EVENT: `EDIT_EVENT`,
  DELETE_EVENT: `DELETE_EVENT`,
};

export const UpdateType = {
  MAJOR: `MAJOR`,
  MINOR: `MINOR`,
  PATCH: `PATCH`,
};

export const FilterType = {
  PAST: `PAST`,
  FUTURE: `FUTURE`,
  EVERYTHING: `EVERYTHING`,
};

export const filter = {
  [FilterType.EVERYTHING]: (events) => events,
  [FilterType.FUTURE]: (events) => events.filter((event) => event.startTime > Date.now()),
  [FilterType.PAST]: (events) => events.filter((event) => event.endTime < Date.now())
};

export const datePickerOptions = {
  enableTime: true,
  dateFormat: `d/m/y H:i`,
};

export const MenuItem = {
  TABLE: `TABLE`,
  STATS: `STATS`
};

export const EventEditMode = {
  EDIT_EVENT: `EDIT_EVENT`,
  ADD_EVENT: `ADD_EVENT`
};

export const CREATE_TRIP = {
  type: `Taxi`,
  destination: ``,
  description: ``,
  startTime: Date.now(),
  endTime: Date.now() + 86400 * 1000,
  price: 100,
  photos: [],
  offers: [],
  isFavorite: false
};
