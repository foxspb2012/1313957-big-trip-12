import EventView from '../view/event.js';
import EventEditView from '../view/event-edit.js';
import {render, RenderPosition, remove, replace} from '../utils/render.js';
import {UpdateType, UserAction, EventEditMode} from '../const.js';
import {isDatesEqual} from '../utils/common.js';

const Mode = {
  DEFAULT: `DEFAULT`,
  EDITING: `EDITING`,
};

export const State = {
  SAVING: `SAVING`,
  DELETING: `DELETING`,
  ABORTING: `ABORTING`,
};

export default class Event {
  constructor(eventList, changeData, changeMode) {
    this._eventList = eventList;
    this._changeData = changeData;
    this._changeMode = changeMode;
    this._event = null;
    this._eventComponent = null;
    this._eventEditComponent = null;
    this._mode = Mode.DEFAULT;
    this._availableOffers = null;
    this._destinations = null;

    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
    this._eventClickHandler = this._eventClickHandler.bind(this);
    this._eventEditClickHandler = this._eventEditClickHandler.bind(this);
    this._deleteClickHandler = this._deleteClickHandler.bind(this);
    this._formSubmitHandler = this._formSubmitHandler.bind(this);
  }

  init(event) {
    const prevEventComponent = this._eventComponent;
    const prevEventEditComponent = this._eventEditComponent;

    this._event = event;
    this._eventComponent = new EventView(event);
    this._eventEditComponent = new EventEditView(event, EventEditMode.EDIT_EVENT);

    this._eventComponent.setClickHandler(this._eventClickHandler);
    this._eventEditComponent.setClickHandler(this._eventEditClickHandler);
    this._eventEditComponent.setFormSubmitHandler(this._formSubmitHandler);
    this._eventEditComponent.setDeleteClickHandler(this._deleteClickHandler);

    if (prevEventComponent === null || prevEventEditComponent === null) {
      render(this._eventList, this._eventComponent, RenderPosition.BEFOREEND);
      return;
    }

    if (this._mode === Mode.DEFAULT) {
      replace(this._eventComponent, prevEventComponent);
    }

    if (this._mode === Mode.EDITING) {
      replace(this._eventComponent, prevEventEditComponent);
      this._mode = Mode.DEFAULT;
    }

    remove(prevEventComponent);
    remove(prevEventEditComponent);
  }

  destroy() {
    remove(this._eventComponent);
    remove(this._eventEditComponent);
  }

  resetView() {
    if (this._mode !== Mode.DEFAULT) {
      this._replaceFormToCard();
    }
  }

  setViewState(state) {
    const resetFormState = () => {
      this._eventEditComponent.updateData({isSaving: false, isDisabled: false, isDeleting: false});
    };

    switch (state) {
      case State.SAVING:
        this._eventEditComponent.updateData({isSaving: true, isDisabled: true});
        break;
      case State.DELETING:
        this._eventEditComponent.updateData({isDeleting: true, isDisabled: true});
        break;
      case State.ABORTING:
        this._eventComponent.shake(resetFormState);
        this._eventEditComponent.shake(resetFormState);
        break;
    }
  }

  _replaceCardToForm() {
    replace(this._eventEditComponent, this._eventComponent);
    document.addEventListener(`keydown`, this._escKeyDownHandler);
    this._changeMode();
    this._mode = Mode.EDITING;
  }

  _replaceFormToCard() {
    replace(this._eventComponent, this._eventEditComponent);
    document.removeEventListener(`keydown`, this._escKeyDownHandler);
    this._mode = Mode.DEFAULT;
  }

  _escKeyDownHandler(evt) {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      evt.preventDefault();
      this._eventEditComponent.reset(this._event);
      this._replaceFormToCard();
    }
  }

  _eventClickHandler() {
    this._replaceCardToForm();
  }

  _eventEditClickHandler() {
    this._eventEditComponent.reset(this._event);
    this._replaceFormToCard();
  }

  _deleteClickHandler(event) {
    this._changeData(UserAction.DELETE_EVENT, UpdateType.MAJOR, event);
  }

  _formSubmitHandler(update) {
    const isMajorUpdate = !isDatesEqual(this._event.startTime, update.startTime) || !isDatesEqual(this._event.endTime, update.endTime);
    this._changeData(UserAction.EDIT_EVENT, isMajorUpdate ? UpdateType.MAJOR : UpdateType.PATCH, update);
  }
}
