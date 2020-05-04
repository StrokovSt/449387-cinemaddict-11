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

const getSortedFilms = (films, sortType) => {
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

  return sortedFilms;
};

export default class FilmsSectionListController {
  constructor(container) {
    this._container = container;
    this._showMoreButtonComponent = new ShomMoreButtonComponent();
    this._filmSection = new FilmsSectionComponent();
    this._failFilmSection = new FailFilmSectionComponent();
    this._mainFilmSection = new MainFilmSectionComponent();
    this._showingFilmsCount = DEFAULT_FILMS_COUNT;
    this._filmCardController = null;
    this._filmListContainer = null;
    this._mainFilmsSection = null;
    this.films = [];
    this.sortComponent = new SortComponent(generateSortOptions());
  }

  renderShowMoreButton(films, filmsListContainer) {
    if (this._showingFilmsCount >= films.length) {
      return;
    }

    render(filmsListContainer, this._showMoreButtonComponent, RenderPosition.BEFOREEND);
  }

  renderCards(films, prevFilmsCount) {
    films.slice(prevFilmsCount, this._showingFilmsCount).forEach((film) => {
      this._filmCardController.render(film);
    });
  }

  init(films) {
    this._filmListContainer = document.querySelector(`.films-list__container`);
    this._filmCardController = new FilmCardController(this._filmListContainer);
    this._mainFilmsSection = document.querySelector(`.films-list`);
    this.films = films;
  }

  addHandlers(films) {
    this._showMoreButtonComponent.setClickHandler(() => {
      const prevFilmsCount = this._showingFilmsCount;
      this._showingFilmsCount += DEFAULT_FILMS_COUNT;

      this.renderCards(this.films, prevFilmsCount);

      if (this._showingFilmsCount >= this.films.length) {
        remove(this._showMoreButtonComponent);
      }
    });

    this.sortComponent.setSortTypeChangeHandler((sortType) => {
      this._showingFilmsCount = DEFAULT_FILMS_COUNT;
      this.films = getSortedFilms(films, sortType);

      this._filmListContainer.innerHTML = ``;

      this.renderCards(this.films, 0);
      this.renderShowMoreButton(this.films, this._mainFilmsSection);
    });
  }

  render(films) {
    const filterNumbers = findOutTheFilterNumbers(films);
    const filterOptions = generateFilterOptions(filterNumbers);

    render(mainElement, new FilterComponent(filterOptions), RenderPosition.BEFOREEND);
    render(this._container, this.sortComponent, RenderPosition.BEFOREEND);
    render(this._container, this._filmSection, RenderPosition.BEFOREEND);
    const filmsSection = document.querySelector(`.films`);

    if (films.length === 0) {
      render(filmsSection, this._failFilmSection, RenderPosition.BEFOREEND);
      return;
    }

    render(filmsSection, this._mainFilmSection, RenderPosition.BEFOREEND);
    this.init(films);
    this.addHandlers(films);

    this.renderCards(films, 0);
    this.renderShowMoreButton(films, this._mainFilmsSection);
  }
}
