import AbstractSmartComponent from "./abstract-smart-component.js";

const createFilmCardControls = (film) => {
  const {isInWatchlist, isWatched, isFavorite} = film;
  return (
    `<form class="film-card__controls">
      <button class="film-card__controls-item button ${isInWatchlist ? `film-card__controls-item--active` : ``} film-card__controls-item--add-to-watchlist">Add to watchlist</button>
      <button class="film-card__controls-item button ${isWatched ? `film-card__controls-item--active` : ``} film-card__controls-item--mark-as-watched">Mark as watched</button>
      <button class="film-card__controls-item button ${isFavorite ? `film-card__controls-item--active` : ``} film-card__controls-item--favorite">Mark as favorite</button>
    </form>`
  );
};

export default class PopupControls extends AbstractSmartComponent {
  constructor(film) {
    super();
    this._film = film;

    this._watchlistClickHandler = null;
    this._watchedClickHandler = null;
    this._favoriteClickHandler = null;
  }

  getTemplate() {
    return createFilmCardControls(this._film);
  }

  recoveryListeners() {
    this.setWatchlistButtonClickHandler(this._watchlistClickHandler);
    this.setHistorytButtonClickHandler(this._watchedClickHandler);
    this.setFavoritesButtonClickHandler(this._favoriteClickHandler);
  }

  setWatchlistButtonClickHandler(handler) {
    this.getElement().querySelector(`.film-card__controls-item--add-to-watchlist`).addEventListener(`click`, handler);
    this._watchlistClickHandler = handler;
  }

  setHistorytButtonClickHandler(handler) {
    this.getElement().querySelector(`.film-card__controls-item--mark-as-watched`).addEventListener(`click`, handler);
    this._watchedClickHandler = handler;
  }

  setFavoritesButtonClickHandler(handler) {
    this.getElement().querySelector(`.film-card__controls-item--favorite`).addEventListener(`click`, handler);
    this._favoriteClickHandler = handler;
  }
}
