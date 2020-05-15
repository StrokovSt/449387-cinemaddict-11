import FilmCardComponent from "../components/film-card.js";
import FilmPopupComponent from "../components/film-popup.js";
import FilmPopupCommentsComponent from "../components/film-popup-comments.js";

import {RenderPosition, render, remove, replace} from "../utils/render.js";

export default class FilmCardController {
  constructor(container, onDataChange, onViewChange) {
    this._container = container;
    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;

    this._film = {};
    this._filmCardComponent = null;
    this._filmPopupComponent = null;
    this._filmPopupCommentsComponent = null;

    this._onEscKeyDown = this._onEscKeyDown.bind(this);
  }

  render(film) {
    this._film = film;

    const oldFilmCardComponent = this._filmCardComponent;
    this._filmCardComponent = new FilmCardComponent(film);

    //  Если уже существует карточка фильма - перерисовать её

    if (oldFilmCardComponent) {
      replace(this._filmCardComponent, oldFilmCardComponent);
    } else {
      render(this._container, this._filmCardComponent, RenderPosition.BEFOREEND);
    }

    //  Обработчики на карточку фильма

    this._filmCardComponent.setWatchlistButtonClickHandler((evt) => {
      evt.preventDefault();
      this._onDataChange(this._film, Object.assign({}, this._film, {
        watchlist: !this._film.watchlist
      }));
    });

    this._filmCardComponent.setHistorytButtonClickHandler((evt) => {
      evt.preventDefault();
      this._onDataChange(this._film, Object.assign({}, this._film, {
        alreadyWatched: !this._film.alreadyWatched
      }));
    });

    this._filmCardComponent.setFavoritesButtonClickHandler((evt) => {
      evt.preventDefault();
      this._onDataChange(this._film, Object.assign({}, this._film, {
        favorite: !this._film.favorite
      }));
    });

    this._filmCardComponent.setFilmClickHandler(() => {
      this._renderFilmPopup();
    });
  }

  //  Рендер попапа  (подробной карточки фильма)

  _renderFilmPopup() {
    this._onViewChange(); // удалит другие попапы, если они есть
    const siteBodyElement = document.querySelector(`body`);

    this._filmPopupComponent = new FilmPopupComponent(this._film);
    this._filmPopupCommentsComponent = new FilmPopupCommentsComponent(this._film.comments);
    render(siteBodyElement, this._filmPopupComponent, RenderPosition.BEFOREEND);
    render(this._filmPopupComponent.getPopupCommentsContainer(), this._filmPopupCommentsComponent, RenderPosition.BEFOREEND);

    //  Обработчики на попап

    this._filmPopupComponent.setCloseButtonHandler(() => {
      this._onFilmDetailCloseButtonClick();
    });

    this._filmPopupComponent.setWatchlistButtonClickHandler(() => {
      this._onDataChange(this._film, Object.assign({}, this._film, {
        watchlist: !this._film.watchlist
      }));
    });

    this._filmPopupComponent.setHistorytButtonClickHandler(() => {
      this._onDataChange(this._film, Object.assign({}, this._film, {
        alreadyWatched: !this._film.alreadyWatched
      }));
    });

    this._filmPopupComponent.setFavoritesButtonClickHandler(() => {
      this._onDataChange(this._film, Object.assign({}, this._film, {
        favorite: !this._film.favorite
      }));
    });

    //  Обработчики на комментарии

    this._filmPopupCommentsComponent.setEmojiClickHandler((evt) => {
      if (evt.target.tagName !== `INPUT`) {
        return;
      }
      this._filmPopupCommentsComponent.setNewCommentEmoji(evt.target.value);
      this._filmPopupCommentsComponent.rerender();
    });

    this._filmPopupCommentsComponent.setCloseButtonClickHandler((evt) => {
      evt.preventDefault();
      if (evt.target.tagName !== `BUTTON`) {
        return;
      }
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

  destroy() {
    remove(this._filmCardComponent);
    this.setDefaultView();
  }

  setDefaultView() {
    if (this._filmPopupComponent) {
      remove(this._filmPopupComponent);
    }
  }
}
