import {getRandomInteger} from '../utils/common.js';
import {typesTransfer, typesActivity, eventsDestinations, eventDescriptions, offers} from '../const.js';
const EVENTS_COUNT = 20;

const tripTypes = Object.keys(typesTransfer).concat(Object.keys(typesActivity));

const getRandomDate = () => Date.now() + Math.floor(Math.random() * 7 * 24 * getRandomInteger(0, 60) * 60 * 1000);
const getDescription = (arr) => {
  return arr.slice(0, getRandomInteger(1, arr.length - 1)).join(``);
};
const getPhotos = () => new Array(getRandomInteger(1, 5)).fill().map(() => `http://picsum.photos/248/152?r=${Math.random()}`);
const generateId = () => Date.now() + parseInt(Math.random() * 10000, 10);

const createTrip = () => {
  const startTime = getRandomDate();
  const endTime = getRandomDate();
  return {
    id: generateId(),
    type: tripTypes[getRandomInteger(0, tripTypes.length - 1)],
    destination: eventsDestinations[getRandomInteger(0, eventsDestinations.length - 1)],
    description: getDescription(eventDescriptions),
    startTime: Math.min(startTime, endTime),
    endTime: Math.max(startTime, endTime),
    price: getRandomInteger(10, 180),
    isFavorite: getRandomInteger(0, 1),
    photos: getPhotos(),
    offers: offers.slice(0, getRandomInteger(0, 5))
  };
};

export const trips = new Array(EVENTS_COUNT).fill().map(createTrip).sort((a, b) => a.startTime - b.startTime);
