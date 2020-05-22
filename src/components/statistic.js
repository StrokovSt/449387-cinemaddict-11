import moment from "moment";
import AbstractSmartComponent from "./abstract-smart-component.js";
import {StatisticFilterTypes} from "../const.js";

const createFilterMarkup = (filter, isChecked) => {
  return (
    `<input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-${filter}" value="${filter}" ${isChecked ? `checked` : ``}>
    <label for="statistic-${filter}" class="statistic__filters-label">${filter}</label>`
  );
};

// Возвращает суммированное время для всех просмотренных фильмов

const createFilmsDuration = (films) => {
  let filmsDuration = 0;
  films.forEach((film) => {
    filmsDuration += film.runtime;
  });
  return filmsDuration;
};

// Возвращает массив жанров в порядке их убывания

const createGenresStatistic = (genres) => {
  let genresStatistic = {};
  genres.forEach((genre) => {
    if (genresStatistic[genre] !== undefined) {
      ++genresStatistic[genre];
    } else {
      genresStatistic[genre] = 1;
    }
  });
  const sortedGenres = Object.entries(genresStatistic);
  return sortedGenres.slice().sort((a, b) => b[1] - a[1]);
};

const checkFilmForFilter = (film, currentFilterType) => {
  const currentDate = new Date();
  let isFiltered = false;
  switch (currentFilterType) {
    case StatisticFilterTypes.ALL_TIME:
      isFiltered = true;
      break;
    case StatisticFilterTypes.TODAY:
      isFiltered = moment(currentDate).diff(film.watchingDate, `days`) === 0;
      break;
    case StatisticFilterTypes.WEEK:
      isFiltered = moment(currentDate).diff(film.watchingDate, `weeks`) === 0;
      break;
    case StatisticFilterTypes.MONTH:
      isFiltered = moment(currentDate).diff(film.watchingDate, `month`) === 0;
      break;
    case StatisticFilterTypes.YEAR:
      isFiltered = moment(currentDate).diff(film.watchingDate, `year`) === 0;
      break;
  }
  return isFiltered;
};

const getWatchedFilmsGenres = (watchedFilms) => {
  let genres = [];
  watchedFilms.forEach((film) => {
    genres = genres.concat(film.genry);
  });
  return genres;
};

const createStatisticTemplate = (filmModel, currentFilterType) => {
  const filtersMarkup = Object.values(StatisticFilterTypes).map((filter) => {
    return createFilterMarkup(filter, filter === currentFilterType);
  }).join(`\n`);

  const watchedFilms = filmModel.getWatchedFilms();
  const filteredFilms = watchedFilms.filter((film) => checkFilmForFilter(film, currentFilterType));

  const watchedFilmsCount = filteredFilms.length;
  const watchedFilmsDuration = createFilmsDuration(filteredFilms);
  const hours = Math.trunc(watchedFilmsDuration / 60);
  const minutes = watchedFilmsDuration % 60;

  const watchedFilmsGenres = getWatchedFilmsGenres(filteredFilms);
  const genresStatistic = createGenresStatistic(watchedFilmsGenres);

  return (
    `<section class="statistic">
      <p class="statistic__rank">
        Your rank
        <img class="statistic__img" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
        <span class="statistic__rank-label">Sci-Fighter</span>
      </p>

      <form action="https://echo.htmlacademy.ru/" method="get" class="statistic__filters">
        <p class="statistic__filters-description">Show stats:</p>
        ${filtersMarkup}
      </form>

      <ul class="statistic__text-list">
        <li class="statistic__text-item">
          <h4 class="statistic__item-title">You watched</h4>
          <p class="statistic__item-text">${watchedFilmsCount}<span class="statistic__item-description">movies</span></p>
        </li>
        <li class="statistic__text-item">
          <h4 class="statistic__item-title">Total duration</h4>
          <p class="statistic__item-text">${hours}<span class="statistic__item-description">h</span>${minutes}<span class="statistic__item-description">m</span></p>
        </li>
        <li class="statistic__text-item">
          <h4 class="statistic__item-title">Top genre</h4>
          <p class="statistic__item-text">${genresStatistic.length > 0 ? genresStatistic[0][0] : ``}</p>
        </li>
      </ul>

      <div class="statistic__chart-wrap">
        <canvas class="statistic__chart" width="1000"></canvas>
      </div>

    </section>`
  );
};

export default class Statistic extends AbstractSmartComponent {
  constructor(filmModel) {
    super();

    this._watchedFilms = null;
    this._filmModel = filmModel;
    this._currentFilterType = StatisticFilterTypes.ALL_TIME;
  }

  getTemplate() {
    return createStatisticTemplate(this._filmModel, this._currentFilterType);
  }

  show() {
    super.show();
    this._currentFilterType = StatisticFilterTypes.ALL_TIME;
    this.rerender();
  }

  recoveryListeners() {
    this._setActiveFilter();
  }

  _setActiveFilter() {
    this.getElement().querySelector(`.statistic__filters`).addEventListener(`click`, (evt) => {
      if (evt.target.tagName !== `INPUT`) {
        return;
      }
      this._currentFilterType = evt.target.value;
      this.rerender();
    });
  }
}
