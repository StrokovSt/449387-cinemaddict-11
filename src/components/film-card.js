import moment from "moment";
import AbstractComponent from "./abstract-component.js";
import {getTimeFromMins} from "../utils/auxiliary-functions.js";

const createFilmCardTemplate = (film) => {
  const {title, rating, releaseDate, duration, genre, poster, description, comments, isInWatchlist, isWatched, isFavorite} = film;
  const year = moment(releaseDate).format(`YYYY`);
  const filmDuration = getTimeFromMins(duration);
  return (
    `<article class="film-card">
      <h3 class="film-card__title">${title}</h3>
      <p class="film-card__rating">${rating}</p>
      <p class="film-card__info">
        <span class="film-card__year">${year}</span>
        <span class="film-card__duration">${filmDuration}</span>
        <span class="film-card__genre">${genre[0] ? genre[0] : ``}</span>
      </p>
      <img src="${poster}" alt="" class="film-card__poster">
      <p class="film-card__description">${description}</p>
      <a class="film-card__comments">${comments.length} comments</a>
    </article>`
  );
};

export default class FilmCard extends AbstractComponent {
  constructor(film) {
    super();
    this._film = film;
  }

  getTemplate() {
    return createFilmCardTemplate(this._film);
  }

  setFilmClickHandler(handler) {
    this.getElement().querySelector(`.film-card__title`).addEventListener(`click`, handler);
    this.getElement().querySelector(`.film-card__poster`).addEventListener(`click`, handler);
    this.getElement().querySelector(`.film-card__comments`).addEventListener(`click`, handler);
  }
}
