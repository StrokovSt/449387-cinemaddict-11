import SortComponent, {sortTypes} from "../components/sort.js";
import FilterComponent from "../components/filter.js";

import FilmsSectionComponent from "../components/films-section.js";
import MainFilmSectionComponent from "../components/films-list-section.js";
import FailFilmSectionComponent from "../components/films-fail-section.js";
import ShomMoreButtonComponent from "../components/show-more-button.js";
import FilmCardController from "../controllers/film-card-controller.js";

import {generateSortOptions} from "../mock/mock-sort.js";
import {generateFilterOptions} from "../mock/mock-filter.js";

import {RenderPosition, render, remove} from "../utils/render.js";

const DEFAULT_FILMS_COUNT = 5;

const mainElement = document.querySelector(`.main`);

const findOutTheFilterNumbers = (films) => {
  let watchNumber = 0;
  let historyNumber = 0;
  let favoritesNumber = 0;
  for (let i = 0; i < films.length; i++) {
    if (films[i].watchlist) {
      watchNumber++;
    }
    if (films[i].history) {
      historyNumber++;
    }
    if (films[i].favorites) {
      favoritesNumber++;
    }
  }
  const filterNumbers = [watchNumber, historyNumber, favoritesNumber];
  return filterNumbers;
};

const getSortedFilms = (films, sortType, from, to) => {
  let sortedFilms = [];
  const choosenFilms = films.slice();
  switch (sortType) {
    case sortTypes.DEFAULT:
      sortedFilms = choosenFilms;
      break;
    case sortTypes.SORT_BY_DATE:
      sortedFilms = choosenFilms.sort((a, b) => b.year - a.year);
      break;
    case sortTypes.SORT_BY_RATING:
      sortedFilms = choosenFilms.sort((a, b) => b.rating - a.rating);
      break;
  }

  return sortedFilms.slice(from, to);
};

const renderFilms = (filmListContainer, films) => {
  return films.map((film) => {
    const filmController = new FilmCardController(filmListContainer);
    filmController.render(film);

    return filmController;
  });
};

export default class FilmsSectionListController {
  constructor(container) {
    this._container = container;
    this._filmsSection = new FilmsSectionComponent();
    this._failFilmSection = new FailFilmSectionComponent();
    this._mainFilmSection = new MainFilmSectionComponent();
    this._showMoreButtonComponent = new ShomMoreButtonComponent();
    this._sortComponent = new SortComponent(generateSortOptions());
    this._showingFilmsCount = DEFAULT_FILMS_COUNT;
    this._filmCardController = null;
    this._filmListContainer = null;
    this._mainFilmsSection = null;
    this.films = [];
    this._showedFilmsControllers = [];

    this._onSortTypeChange = this._onSortTypeChange.bind(this);
    this._sortComponent.setSortTypeChangeHandler(this._onSortTypeChange);
  }

  _renderShowMoreButton() {
    if (this._showingFilmsCount >= this.films.length) {
      return;
    }

    render(this._mainFilmsSection, this._showMoreButtonComponent, RenderPosition.BEFOREEND);

    this._showMoreButtonComponent.setClickHandler(() => {
      const prevFilmsCount = this._showingFilmsCount;
      this._showingFilmsCount += DEFAULT_FILMS_COUNT;

      const sortedFilms = getSortedFilms(this.films, this._sortComponent.getSortType(), prevFilmsCount, this._showingFilmsCount);
      const newFilms = renderFilms(this._filmListContainer, sortedFilms);

      this._showedFilmsControllers = this._showedFilmsControllers.concat(newFilms);

      if (this._showingFilmsCount >= this.films.length) {
        remove(this._showMoreButtonComponent);
      }
    });
  }

  _onSortTypeChange(sortType) {
    this._showingFilmsCount = DEFAULT_FILMS_COUNT;
    const sortedFilms = getSortedFilms(this.films, sortType, 0, this._showingFilmsCount);

    this._filmListContainer.innerHTML = ``;

    const newFilms = renderFilms(this._filmListContainer, sortedFilms);
    this._showedFilmsControllers = newFilms;

    this._renderShowMoreButton();
  }

  render(films) {
    this.films = films;

    const filterNumbers = findOutTheFilterNumbers(films);
    const filterOptions = generateFilterOptions(filterNumbers);

    render(mainElement, new FilterComponent(filterOptions), RenderPosition.BEFOREEND);
    render(this._container, this._sortComponent, RenderPosition.BEFOREEND);
    render(this._container, this._filmsSection, RenderPosition.BEFOREEND);
    const filmsSection = document.querySelector(`.films`);

    if (films.length === 0) {
      render(filmsSection, this._failFilmSection, RenderPosition.BEFOREEND);
      return;
    }

    render(filmsSection, this._mainFilmSection, RenderPosition.BEFOREEND);
    this._filmListContainer = document.querySelector(`.films-list__container`);
    this._filmCardController = new FilmCardController(this._filmListContainer);
    this._mainFilmsSection = document.querySelector(`.films-list`);

    const newFilms = renderFilms(this._filmListContainer, films.slice(0, this._showingFilmsCount));
    this._showedFilmsControllers = this._showedFilmsControllers.concat(newFilms);
    this._renderShowMoreButton();
  }
}
