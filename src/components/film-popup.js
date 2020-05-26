import moment from "moment";
import AbstractSmartComponent from "./abstract-smart-component.js";
import {getTimeFromMins} from "../utils/auxiliary-functions.js";

const createFilmgenre = (genre) => {
  return (
    `<span class="film-details__genre">${genre}</span>`
  );
};

const generateGenres = (genre) => {
  const genresMarkup = genre.map((it) => `${createFilmgenre(it)}`).join(`\n`);
  return genresMarkup;
};

const createFilmDetailTemplate = (film) => {
  const {title, rating, releaseDate, duration, genre, poster, description, ageRating, director, writers, actors, country} = film;

  const manyGenres = generateGenres(genre);
  const filmReleaseDate = moment(releaseDate).format(`D MMMM YYYY`);
  const filmDuration = getTimeFromMins(duration);

  return (
    `<section class="film-details">
      <form class="film-details__inner" action="" method="get">
        <div class="form-details__top-container">
          <div class="film-details__close">
            <button class="film-details__close-btn" type="button">close</button>
          </div>
          <div class="film-details__info-wrap">
            <div class="film-details__poster">
              <img class="film-details__poster-img" src="${poster}" alt="">
              <p class="film-details__age">${ageRating}</p>
            </div>
            <div class="film-details__info">
              <div class="film-details__info-head">
                <div class="film-details__title-wrap">
                  <h3 class="film-details__title">${title}</h3>
                  <p class="film-details__title-original">Original: ${title}</p>
                </div>
                <div class="film-details__rating">
                  <p class="film-details__total-rating">${rating}</p>
                </div>
              </div>
              <table class="film-details__table">
                <tr class="film-details__row">
                  <td class="film-details__term">Director</td>
                  <td class="film-details__cell">${director}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Writers</td>
                  <td class="film-details__cell">${writers}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Actors</td>
                  <td class="film-details__cell">${actors}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Release Date</td>
                  <td class="film-details__cell">${filmReleaseDate}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Runtime</td>
                  <td class="film-details__cell">${filmDuration}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Country</td>
                  <td class="film-details__cell">${country}</td>
                </tr>
                ${genre.length === 0 ? `` : `<tr class="film-details__row">
                                              <td class="film-details__term">${genre.length > 1 ? `Genres` : `Genre`}</td>
                                              <td class="film-details__cell">
                                                <span class="film-details__genre">${manyGenres}</span>
                                            </tr>`}
              </table>
              <p class="film-details__film-description">
                ${description}
              </p>
            </div>
          </div>
        </div>
        <div class="form-details__bottom-container"></div>
      </form>
    </section>`
  );
};

export default class FilmDetail extends AbstractSmartComponent {
  constructor(film) {
    super();
    this._film = film;
  }

  getTemplate() {
    return createFilmDetailTemplate(this._film);
  }

  getPopupControlsContainer() {
    return this.getElement().querySelector(`.form-details__top-container`);
  }

  getPopupCommentsContainer() {
    return this.getElement().querySelector(`.form-details__bottom-container`);
  }

  setCloseButtonHandler(handler) {
    this.getElement().querySelector(`.film-details__close-btn`).addEventListener(`click`, handler);
  }
}
