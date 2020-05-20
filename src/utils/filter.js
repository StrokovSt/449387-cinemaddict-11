import {FilterTypes} from "../const.js";

export const getFilmsByFilter = (filterType, films) => {
  switch (filterType) {
    case FilterTypes.ALL:
      return films;
    case FilterTypes.WATCHLIST:
      return films.filter((film) => {
        return film.watchlist;
      });
    case FilterTypes.HISTORY:
      return films.filter((film) => {
        return film.alreadyWatched;
      });
    case FilterTypes.FAVORITES:
      return films.filter((film) => {
        return film.favorite;
      });
  }
  return films;
};
