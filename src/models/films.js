import {getFilmsByFilter} from "../utils/filter.js";

export default class Films {
  constructor() {
    this._films = [];
    this._filterType = ``;

    this._dataChangeHandlers = [];
    this._filterChangeHandlers = [];
  }

  getFilteredFilms() {
    return getFilmsByFilter(this._filterType, this._films);
  }

  getFilms() {
    return this._films;
  }

  getTopRatedFilms() {
    return this._films.slice().sort((a, b) => b.rating - a.rating);
  }

  getTopCommentedFilms() {
    return this._films.slice().sort((a, b) => b.commentsNumber - a.commentsNumber);
  }

  setFilms(films) {
    this._films = Array.from(films);
    this._callHandlers(this._dataChangeHandlers);
  }

  updateFilm(id, film) {
    const index = this._films.findIndex((it) => it.id === id);

    if (index === -1) {
      return false;
    }

    this._films = [].concat(this._films.slice(0, index), film, this._films.slice(index + 1));

    this._callHandlers(this._dataChangeHandlers);
    return true;
  }

  setDataChangeHandler(handler) {
    this._dataChangeHandlers.push(handler);
  }

  setFilterChangeHandler(handler) {
    this._filterChangeHandlers.push(handler);
  }

  _callHandlers(handlers) {
    handlers.forEach((handler) => handler());
  }

  setFilter(filterType) {
    this._filterType = filterType;
    this._callHandlers(this._filterChangeHandlers);
  }
}
