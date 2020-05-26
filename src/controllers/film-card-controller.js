import FilmModel from "../models/film-adapter.js";
import FilmCardComponent from "../components/film-card.js";
import FilmCardControlsComponent from "../components/film-card-controls.js";
import PopupController from "../controllers/popup-controller.js";
import {RenderPosition, render, remove, replace} from "../utils/render.js";

const SHAKE_ANIMATION_TIMEOUT = 600;

export default class FilmCardController {
  constructor(container, onDataChange, onViewChange, onPopupDataChange, api) {
    this._container = container;
    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;
    this._onPopupDataChange = onPopupDataChange;
    this._api = api;

    this._film = {};
    this._filmCardComponent = null;
    this._filmCardControlsComponent = null;

    this._popupController = null;

    this._showPopup = this._showPopup.bind(this);
  }

  render(film) {
    this._film = film;

    const oldFilmCardComponent = this._filmCardComponent;
    const oldFilmCardControlsComponent = this._filmCardControlsComponent;
    this._filmCardComponent = new FilmCardComponent(this._film);
    this._filmCardControlsComponent = new FilmCardControlsComponent(this._film);

    //  Если уже существует карточка фильма - перерисовать её

    if (oldFilmCardComponent) {
      replace(this._filmCardControlsComponent, oldFilmCardControlsComponent);
      if (this._popupController) {
        this._popupController.render(this._film);
      }
    } else {
      render(this._container, this._filmCardComponent, RenderPosition.BEFOREEND);
      render(this._filmCardComponent.getElement(), this._filmCardControlsComponent, RenderPosition.BEFOREEND);
    }

    //  Обработчики на карточку фильма

    this._filmCardControlsComponent.setWatchlistButtonClickHandler((evt) => {
      evt.preventDefault();
      const newFilm = FilmModel.clone(this._film);
      newFilm.isInWatchlist = !newFilm.isInWatchlist;
      this._onDataChange(this._film, newFilm);
    });

    this._filmCardControlsComponent.setHistorytButtonClickHandler((evt) => {
      evt.preventDefault();
      const newFilm = FilmModel.clone(this._film);
      newFilm.isWatched = !newFilm.isWatched;
      newFilm.watchingDate = new Date();
      this._onDataChange(this._film, newFilm);
    });

    this._filmCardControlsComponent.setFavoritesButtonClickHandler((evt) => {
      evt.preventDefault();
      const newFilm = FilmModel.clone(this._film);
      newFilm.isFavorite = !newFilm.isFavorite;
      this._onDataChange(this._film, newFilm);
    });

    this._filmCardComponent.setFilmClickHandler(() => {
      this._showPopup();
    });
  }

  _showPopup() {
    this._onViewChange();
    this._popupController = new PopupController(this._onDataChange, this._onViewChange, this._onPopupDataChange, this._api);
    this._popupController.render(this._film);
  }

  destroy() {
    remove(this._filmCardComponent);
    this.setDefaultView();
  }

  setDefaultView() {
    if (this._popupController) {
      this._popupController.remove();
    }
  }

  shake() {
    this._filmCardComponent.getElement().style.animation = `shake ${SHAKE_ANIMATION_TIMEOUT / 1000}s`;

    setTimeout(() => {
      this._filmCardComponent.getElement().style.animation = ``;
    }, SHAKE_ANIMATION_TIMEOUT);
  }

}
