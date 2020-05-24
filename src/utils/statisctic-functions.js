import moment from "moment";
import {StatisticFilterTypes} from "../const.js";

// Возвращает массив жанров

export const getWatchedFilmsGenres = (watchedFilms) => {
  let genres = [];
  watchedFilms.forEach((film) => {
    genres = genres.concat(film.genre);
  });
  return genres;
};

// Возвращает суммированное время для всех просмотренных фильмов

export const createFilmsDuration = (films) => {
  let filmsDuration = 0;
  films.forEach((film) => {
    filmsDuration += film.duration;
  });
  return filmsDuration;
};

// Возвращает массив жанров в порядке их убывания

export const createGenresStatistic = (genres) => {
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

// Возвращает массив фильмов соответствующих выбранному фильтру

export const checkFilmForFilter = (film, currentFilterType) => {
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
