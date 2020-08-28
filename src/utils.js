export const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

export const getRandomElementFromArray = (array) => {
  const randomIndex = getRandomInteger(0, array.length - 1);
  return array[randomIndex];
};

export const createElement = (template) => {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template;

  return newElement.firstChild;
};

export const render = (container, element, place) => {
  switch (place) {
    case `afterbegin`:
      container.prepend(element);
      break;
    case `beforeend`:
      container.append(element);
      break;
  }
};
