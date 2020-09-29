import EventsModel from '../model/events.js';
import StoreModel from '../model/store.js';

const Method = {
  GET: `GET`,
  PUT: `PUT`,
  POST: `POST`,
  DELETE: `DELETE`,
};

const SuccessHttpStatusRange = {
  MIN: 200,
  MAX: 299,
};

export default class Api {
  constructor(endpoint, authorization) {
    this._endpoint = endpoint;
    this._authorization = authorization;
  }

  getAllData() {
    return Promise.all([
      this.getDestinations(),
      this.getOffers(),
      this.getEvents()
    ]).then((res) => res[2]);
  }

  getEvents() {
    return this._load({url: `points`})
    .then(Api.toJSON)
    .then((events) => events.map(EventsModel.adaptToClient));
  }

  getOffers() {
    return this._load({url: `offers`})
    .then(Api.toJSON)
    .then((res) => StoreModel.setOffers(res));
  }

  getDestinations() {
    return this._load({url: `destinations`})
    .then(Api.toJSON)
    .then((res) => StoreModel.setDestinations(res));
  }

  updateEvent(event) {
    return this._load({
      url: `points/${event.id}`,
      method: Method.PUT,
      body: JSON.stringify(EventsModel.adaptToServer(event)),
      headers: new Headers({'Content-Type': `application/json`})
    })
    .then(Api.toJSON)
    .then(EventsModel.adaptToClient);
  }

  addEvent(event) {
    return this._load({
      url: `points`,
      method: Method.POST,
      body: JSON.stringify(EventsModel.adaptToServer(event)),
      headers: new Headers({'Content-Type': `application/json`})
    })
    .then(Api.toJSON)
    .then(EventsModel.adaptToClient);
  }

  deleteEvent(event) {
    return this._load({
      url: `points/${event.id}`,
      method: Method.DELETE
    });
  }

  _load({
    url,
    method = Method.GET,
    body = null,
    headers = new Headers()
  }) {
    headers.append(`Authorization`, this._authorization);

    return fetch(`${this._endpoint}/${url}`, {method, body, headers})
    .then(Api.checkStatus)
    .catch(Api.catchError);
  }

  static checkStatus(response) {
    if (response.status < SuccessHttpStatusRange.MIN || response.status > SuccessHttpStatusRange.MAX) {
      throw new Error(`${response.status}: ${response.statusText}`);
    }

    return response;
  }

  static catchError(err) {
    throw err;
  }

  static toJSON(response) {
    return response.json();
  }
}
