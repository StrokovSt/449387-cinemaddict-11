import {FilterTypes} from "../const.js";

export const getFilmsByFilter = (filterType, films) => {
  switch (filterType) {
    case FilterTypes.ALL:
      return films;
    case FilterTypes.WATCHLIST:
      return films.filter((film) => {
        return film.isInWatchlist;
      });
    case FilterTypes.HISTORY:
      return films.filter((film) => {
        return film.isWatched;
      });
    case FilterTypes.FAVORITES:
      return films.filter((film) => {
        return film.isFavorite;
      });
  }
  return films;
};
