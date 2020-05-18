import PopupComponent from "../components/film-popup.js";
import PopupCommentsComponent from "../components/film-popup-comments.js";

import {RenderPosition, render, remove, replace} from "../utils/render.js";

const siteBodyElement = document.querySelector(`body`);

export default class PopupController {
  constructor(onDataChange, onViewChange, onPopupDataChange) {
    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;
    this._onPopupDataChange = onPopupDataChange;

    this._film = {};
    this._popupComponent = null;
    this._popupCommentsComponent = null;

    this._onEscKeyDown = this._onEscKeyDown.bind(this);
    this._onFilmDetailCloseButtonClick = this._onFilmDetailCloseButtonClick.bind(this);
  }

  render(film) {
    this._film = film;

    this._onViewChange();
    const oldPopupComponent = this._popupComponent;
    this._popupCommentsComponent = new PopupCommentsComponent(this._film.comments);

    if (oldPopupComponent) {
      replace(this._popupComponent, oldPopupComponent);
    } else {
      this._popupComponent = new PopupComponent(this._film);
      render(siteBodyElement, this._popupComponent, RenderPosition.BEFOREEND);
    }

    render(this._popupComponent.getPopupCommentsContainer(), this._popupCommentsComponent, RenderPosition.BEFOREEND);

    //  Обработчики на попап

    this._popupComponent.setCloseButtonHandler(() => {
      this._onDataChange(this._film, this._film);
      this._onFilmDetailCloseButtonClick();
    });

    this._popupComponent.setWatchlistButtonClickHandler((evt) => {
      evt.preventDefault();
      this._onPopupDataChange(this._film, Object.assign({}, this._film, {
        watchlist: !this._film.watchlist
      }));
    });

    this._popupComponent.setHistorytButtonClickHandler((evt) => {
      evt.preventDefault();
      this._onPopupDataChange(this._film, Object.assign({}, this._film, {
        alreadyWatched: !this._film.alreadyWatched
      }));
    });

    this._popupComponent.setFavoritesButtonClickHandler((evt) => {
      evt.preventDefault();
      this._onPopupDataChange(this._film, Object.assign({}, this._film, {
        favorite: !this._film.favorite
      }));
    });

    //  Обработчики на комментарии

    this._popupCommentsComponent.setEmojiClickHandler((evt) => {
      if (evt.target.tagName !== `INPUT`) {
        return;
      }
      this._popupCommentsComponent.setNewCommentEmoji(evt.target.value);
      this._popupCommentsComponent.rerender();
    });

    this._popupCommentsComponent.setCloseButtonClickHandler((evt) => {
      evt.preventDefault();
      if (evt.target.tagName !== `BUTTON`) {
        return;
      }
    });

    document.addEventListener(`keydown`, this._onEscKeyDown);
  }

  _onFilmDetailCloseButtonClick() {
    remove(this._popupComponent);
    document.removeEventListener(`keydown`, this._onEscKeyDown);
  }

  _onEscKeyDown(evt) {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;
    if (isEscKey) {
      remove(this._popupComponent);
    }
    this._onDataChange(this._film, this._film);
    document.removeEventListener(`keydown`, this._onEscKeyDown);
  }

  remove() {
    if (this._popupComponent) {
      remove(this._popupComponent);
      document.removeEventListener(`keydown`, this._onEscKeyDown);
    }
  }
}
