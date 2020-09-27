import TripInfoView from '../view/trip-info.js';
import TripCostView from '../view/trip-cost.js';
import {render, remove, replace, RenderPosition} from '../utils/render.js';

export default class Info {
  constructor(infoContainer, eventsModel) {
    this._infoContainer = infoContainer;
    this._eventsModel = eventsModel;
    this._tripCostComponent = null;
    this._tripInfoComponent = null;

    this._modelChangeHandler = this._modelChangeHandler.bind(this);
  }

  init() {
    const prevTripCostComponent = this._tripCostComponent;
    const prevTripInfoComponent = this._tripInfoComponent;

    this._tripCostComponent = new TripCostView(this._eventsModel.getEvents());
    this._tripInfoComponent = new TripInfoView(this._eventsModel.getEvents());

    this._eventsModel.addObserver(this._modelChangeHandler);

    if (prevTripInfoComponent === null) {
      render(this._tripInfoComponent, this._tripCostComponent, RenderPosition.BEFOREEND);
      render(this._infoContainer, this._tripInfoComponent, RenderPosition.AFTERBEGIN);
      return;
    }

    render(this._tripInfoComponent, this._tripCostComponent, RenderPosition.BEFOREEND);
    replace(this._tripInfoComponent, prevTripInfoComponent);
    remove(prevTripCostComponent);
    remove(prevTripInfoComponent);
  }

  _modelChangeHandler() {
    this.init();
  }
}
