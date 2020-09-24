export const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

export const getFormatText = (text) => text.toLowerCase().split(` `).join(`-`);

export const getFormatDate = (date) => new Date(date).toLocaleString(`en-US`, {month: `short`, day: `2-digit`});

export const getFormatNumber = (num) => num.toString().padStart(2, `0`);

export const getFormatTime = (time) => new Date(time).toLocaleString(`en-US`, {hour12: false, hour: `2-digit`, minute: `2-digit`});

export const getFormatEditTime = (time) => {
  const date = new Date(time);
  const day = getFormatNumber(date.getDate());
  const month = getFormatNumber(date.getMonth());
  const year = date.getFullYear().toString().slice(0, -2);
  const hours = getFormatNumber(date.getHours());
  const minutes = getFormatNumber(date.getMinutes());

  return `${day}/${month}/${year} ${hours}:${minutes}`;
};

export const sortByPrice = (a, b) => b.price - a.price;
export const sortByTime = (a, b) => (b.endTime - b.startTime - a.endTime + a.startTime);
export const sortByStartTime = (a, b) => a.startTime - b.startTime;
export const isDatesEqual = (a, b) => a === b;

export const updateItem = (arr, item) => {
  const index = arr.findIndex((elem) => item.id === elem.id);
  if (index === -1) {
    return arr;
  }

  return [...arr.slice(0, index), item, ...arr.slice(index + 1)];
};
