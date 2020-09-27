import Observer from '../utils/observer.js';

export default class Events extends Observer {
  constructor() {
    super();
    this._events = [];
  }

  getEvents() {
    return this._events;
  }

  setEvents(updateType, events) {
    this._events = events;
    this._notify(updateType);
  }

  updateEvent(updateType, update) {
    const index = this._events.findIndex((event) => event.id === update.id);

    if (index === -1) {
      throw new Error(`Can't update unexisting event`);
    }

    this._events = [
      ...this._events.slice(0, index),
      update,
      ...this._events.slice(index + 1)
    ];

    this._notify(updateType, update);
  }

  addEvent(updateType, update) {
    this._events = [update, ...this._events];

    this._notify(updateType, update);
  }

  deleteEvent(updateType, update) {
    const index = this._events.findIndex((event) => event.id === update.id);

    this._events = [
      ...this._events.slice(0, index),
      ...this._events.slice(index + 1)
    ];

    this._notify(updateType);
  }

  static adaptToClient(event) {
    const adaptedEvent = Object.assign(
        {},
        event,
        {
          isFavorite: event.is_favorite,
          price: event.base_price,
          startTime: event.date_from !== null ? new Date(event.date_from) : event.date_from,
          endTime: event.date_to !== null ? new Date(event.date_to) : event.date_to,
          isDisabled: false,
          isSaving: false,
          isDeleting: false
        }
    );

    delete adaptedEvent.is_favorite;
    delete adaptedEvent.base_price;
    delete adaptedEvent.date_from;
    delete adaptedEvent.date_to;

    return adaptedEvent;
  }

  static adaptToServer(event) {
    const adaptedEvent = Object.assign(
        {},
        event,
        {
          'is_favorite': event.isFavorite,
          'base_price': Number(event.price),
          'date_from': event.startTime instanceof Date ? event.startTime.toISOString() : null,
          'date_to': event.endTime instanceof Date ? event.endTime.toISOString() : null
        }
    );

    delete adaptedEvent.isFavorite;
    delete adaptedEvent.price;
    delete adaptedEvent.startTime;
    delete adaptedEvent.endTime;
    delete adaptedEvent.isDisabled;
    delete adaptedEvent.isSaving;
    delete adaptedEvent.isDeleting;

    return adaptedEvent;
  }
}
