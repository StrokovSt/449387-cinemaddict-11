import FilmCardComponent from "../components/film-card.js";
import PopupController from "../controllers/popup-controller.js";
import {RenderPosition, render, remove, replace} from "../utils/render.js";

export default class FilmCardController {
  constructor(container, onDataChange, onViewChange, onPopupDataChange, api) {
    this._container = container;
    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;
    this._onPopupDataChange = onPopupDataChange;
    this._api = api;

    this._film = {};
    this._filmCardComponent = null;

    this._popupController = null;

    this._showPopup = this._showPopup.bind(this);
  }

  render(film) {
    this._film = film;

    const oldFilmCardComponent = this._filmCardComponent;
    this._filmCardComponent = new FilmCardComponent(film);

    //  Если уже существует карточка фильма - перерисовать её

    if (oldFilmCardComponent) {
      replace(this._filmCardComponent, oldFilmCardComponent);
      if (this._popupController) {
        this._popupController.render(this._film);
      }
    } else {
      render(this._container, this._filmCardComponent, RenderPosition.BEFOREEND);
    }

    //  Обработчики на карточку фильма

    this._filmCardComponent.setWatchlistButtonClickHandler((evt) => {
      evt.preventDefault();
      this._onDataChange(this._film, Object.assign({}, this._film, {
        isInWatchlist: !this._film.isInWatchlist,
      }));
    });

    this._filmCardComponent.setHistorytButtonClickHandler((evt) => {
      evt.preventDefault();
      if (this._film.watchingDate === undefined) {
        this._onDataChange(this._film, Object.assign({}, this._film, {
          isWatched: !this._film.isWatched,
          watchingDate: new Date(),
        }));
      } else {
        this._onDataChange(this._film, Object.assign({}, this._film, {
          isWatched: !this._film.isWatched,
          watchingDate: undefined,
        }));
      }
    });

    this._filmCardComponent.setFavoritesButtonClickHandler((evt) => {
      evt.preventDefault();
      this._onDataChange(this._film, Object.assign({}, this._film, {
        isFavorite: !this._film.isFavorite
      }));
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

}
