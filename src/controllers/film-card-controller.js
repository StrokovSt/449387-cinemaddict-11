import FilmCardComponent from "../components/film-card.js";
import FilmDetailCardComponent from "../components/film-detail.js";

import {RenderPosition, render, remove, replace} from "../utils/render.js";

export default class FilmCardController {
  constructor(container, onDataChange, onViewChange) {
    this._container = container;
    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;

    this._film = {};
    this._filmCardComponent = null;
    this._filmPopupComponent = null;

    this._onEscKeyDown = this._onEscKeyDown.bind(this);
  }

  render(film) {
    this._film = film;

    const oldFilmCardComponent = this._filmCardComponent;

    this._filmCardComponent = new FilmCardComponent(film);

    if (oldFilmCardComponent) {
      replace(this._filmCardComponent, oldFilmCardComponent);
    } else {
      render(this._container, this._filmCardComponent, RenderPosition.BEFOREEND);
    }

    this._filmCardComponent.setWatchlistButtonClickHandler((evt) => {
      evt.preventDefault();
      this._onDataChange(this._film, Object.assign({}, this._film, {
        watchlist: !this._film.watchlist
      }));
    });

    this._filmCardComponent.setHistorytButtonClickHandler((evt) => {
      evt.preventDefault();
      this._onDataChange(this._film, Object.assign({}, this._film, {
        history: !this._film.history
      }));
    });

    this._filmCardComponent.setFavoritesButtonClickHandler((evt) => {
      evt.preventDefault();
      this._onDataChange(this._film, Object.assign({}, this._film, {
        favorites: !this._film.favorites
      }));
    });

    this._filmCardComponent.setFilmClickHandler((evt) => {
      this._renderFilmPopup();
    });
  }

  _renderFilmPopup() {
    this._onViewChange();
    const siteBodyElement = document.querySelector(`body`);

    this._filmPopupComponent = new FilmDetailCardComponent(this._film);
    render(siteBodyElement, this._filmPopupComponent, RenderPosition.BEFOREEND);

    this._filmPopupComponent.setCloseButtonHandler(() => {
      this._onFilmDetailCloseButtonClick();
    });

    this._filmPopupComponent.setWatchlistButtonClickHandler(() => {
      console.log(`было ` + this._film.watchlist);
      this._onDataChange(this._film, Object.assign({}, this._film, {
        watchlist: !this._film.watchlist
      }));
      console.log(`стало ` + this._film.watchlist);
    });

    document.addEventListener(`keydown`, this._onEscKeyDown);
  }

  _onFilmDetailCloseButtonClick() {
    remove(this._filmPopupComponent);
    document.removeEventListener(`keydown`, this._onEscKeyDown);
  }

  _onEscKeyDown(evt) {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;
    if (isEscKey) {
      remove(this._filmPopupComponent);
    }
    document.removeEventListener(`keydown`, this._onEscKeyDown);
  }

  setDefaultView() {
    if (this._filmPopupComponent) {
      remove(this._filmPopupComponent);
    }
  }
}
