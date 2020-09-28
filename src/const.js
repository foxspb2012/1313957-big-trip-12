export const CREATE_TRIP = {
  type: `bus`,
  destination: {
    name: ``,
    description: ``,
    pictures: [],
  },
  startTime: new Date(),
  endTime: new Date(),
  price: 100,
  photos: [],
  offers: [],
  isFavorite: false,
};

export const MenuItem = {
  TABLE: `TABLE`,
  STATS: `STATS`,
};

export const Preposition = {
  'CHECK-IN': `in`,
  'RESTAURANT': `in`,
  'SIGHTSEEING': `in`,
  'BUS': `to`,
  'SHIP': `to`,
  'TAXI': `to`,
  'DRIVE': `to`,
  'TRAIN': `to`,
  'FLIGHT': `to`,
  'TRANSPORT': `to`,
};

export const SortType = {
  DEFAULT: `event`,
  TIME: `time`,
  PRICE: `price`,
};

export const UpdateType = {
  INIT: `INIT`,
  MINOR: `MINOR`,
  MAJOR: `MAJOR`,
  PATCH: `PATCH`,
};

export const UserAction = {
  ADD_EVENT: `ADD_EVENT`,
  EDIT_EVENT: `EDIT_EVENT`,
  DELETE_EVENT: `DELETE_EVENT`,
};

export const FilterType = {
  EVERYTHING: `EVERYTHING`,
  FUTURE: `FUTURE`,
  PAST: `PAST`,
};

export const EventEditMode = {
  ADD_EVENT: `ADD_EVENT`,
  EDIT_EVENT: `EDIT_EVENT`,
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

export const MAX_OFFERS_LENGTH = 3;

export const types = [`taxi`, `bus`, `train`, `ship`, `transport`, `drive`, `flight`, `check-in`, `sightseeing`, `restaurant`];
export const activityStartIndex = 7;
