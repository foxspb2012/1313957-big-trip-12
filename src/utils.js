export const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

export const render = (container, element, place) => {
  container.insertAdjacentHTML(place, element);
};

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

export const getFormatText = (text) => text.toLowerCase().split(` `).join(`-`);

export const getFormatDate = (date) => new Date(date).toLocaleString(`en-US`, {month: `short`, day: `2-digit`});

export const getFormatNumber = (num) => num.toString().padStart(2, `0`);

export const RenderPosition = {
  AFTERBEGIN: `afterbegin`,
  BEFOREEND: `beforeend`
};

export const createElement = (template) => {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template;
  return newElement.firstChild;
};

export const renderTemplate = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

export const renderElement = (container, element, place) => {
  switch (place) {
    case RenderPosition.AFTERBEGIN:
      container.prepend(element);
      break;

    case RenderPosition.BEFOREEND:
      container.append(element);
      break;
  }
};
