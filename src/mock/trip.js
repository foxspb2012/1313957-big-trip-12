import {getRandomInteger, getRandomElementFromArray} from "../utils.js";
import {eventsTypes, eventsDestinations, eventDescriptions, offers} from "../const.js";

const generateEventOffers = () => {
  let randomOffers = [];
  for (let i = 0; i <= getRandomInteger(0, 5); i++) {
    const randomIndex = getRandomInteger(0, offers.length - 1);
    randomOffers.push(offers[randomIndex]);
  }
  return randomOffers;
};

const generatePrice = () => {
  return Math.ceil(getRandomInteger(20, 180));
};

const generateDescription = () => {
  const randomIndex = getRandomInteger(0, eventDescriptions.length - 1);
  let randomDescriptions = [];
  for (let i = randomIndex; i <= 5; i++) {
    randomDescriptions.push(eventDescriptions[i]);
  }
  return randomDescriptions;
};

const generatePhoto = () => {
  const randomIndex = getRandomInteger(0, eventDescriptions.length - 1);
  let photo = [];
  for (let i = randomIndex; i <= 5; i++) {
    photo.push(`http://picsum.photos/248/152?r=${Math.random()}`);
  }
  return photo;
};

const dateNow = new Date();
const dateNowPlusOneDay = new Date(dateNow.getFullYear(), dateNow.getMonth(), dateNow.getDate() + 1, dateNow.getHours(), dateNow.getMinutes());
const dateNowPlusSomeDays = new Date(dateNowPlusOneDay.getFullYear(), dateNowPlusOneDay.getMonth(), dateNowPlusOneDay.getDate() + Math.floor(Math.random() * 5), dateNowPlusOneDay.getHours(), dateNowPlusOneDay.getMinutes());
const dateNowPlusOneDayInMS = new Date(dateNowPlusOneDay).getTime();
const dateNowPlusSomeDaysInMS = new Date(dateNowPlusSomeDays).getTime();

const getRandomDate = () => {
  const randomDateInMS = getRandomInteger(dateNowPlusOneDayInMS, dateNowPlusSomeDaysInMS);
  const randomDate = new Date(randomDateInMS);
  return randomDate;
};

export const generateEvent = () => {
  return {
    type: getRandomElementFromArray(eventsTypes),
    city: getRandomElementFromArray(eventsDestinations),
    offers: generateEventOffers(),
    isFavorite: Boolean(getRandomInteger(0, 1)),
    price: generatePrice(),
    startDate: getRandomDate(),
    endDate: getRandomDate(),
    destination: {
      image: generatePhoto(),
      description: generateDescription(),
    },
  };
};

