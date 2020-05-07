import FilmCardComponent from "../components/film-card.js";
import FilmDetailCardComponent from "../components/film-detail.js";

import {RenderPosition, render, remove, replace} from "../utils/render.js";

const siteBodyElement = document.querySelector(`body`);

export default class FilmCardController {
  constructor(container, onDataChange) {
    this._container = container;
    this._onDataChange = onDataChange;

    this._filmCard = null;
    this._filmDetailCard = null;

    this._onEscKeyDown = this._onEscKeyDown.bind(this);
  }

  render(film) {
    const oldFilmCardComponent =  this._filmCard;
    const oldFilmDetailCardComponent = this._filmDetailCard;

    this._filmCard = new FilmCardComponent(film);
    this._filmDetailCard = new FilmDetailCardComponent(film);

    this._filmCard.setWatchlistButtonClickHandler((evt) => {
      evt.preventDefault();
      this._onDataChange(this, film, Object.assign({}, film, {
        watchlist: !film.watchlist
      }));
    });

    this._filmCard.setFilmClickHandler((evt) => {
      if (evt.target.classList.contains(`film-card__title`) || evt.target.classList.contains(`film-card__poster`)
      || evt.target.classList.contains(`film-card__comments`)) {
        render(siteBodyElement, this._filmDetailCard, RenderPosition.BEFOREEND);
        document.addEventListener(`keydown`, this._onEscKeyDown);

        this._filmDetailCard.setCloseButtonHandler(() => {
          this._onFilmDetailCloseButtonClick();
        });
      }
    });

    if (oldFilmCardComponent && oldFilmDetailCardComponent) {
      replace(this._filmCard, oldFilmCardComponent);
      replace(this._filmDetailCard, oldFilmDetailCardComponent);
    } else {
      render(this._container, this._filmCard, RenderPosition.BEFOREEND);
    }
  }

  _onFilmDetailCloseButtonClick()  {
    remove(this._filmDetailCard);
    document.removeEventListener(`keydown`, this._onEscKeyDown);
  }

  _onEscKeyDown(evt) {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

    if (isEscKey) {
      remove(this._filmDetailCard);
      document.removeEventListener(`keydown`, this._onEscKeyDown);
    }
  }
}
