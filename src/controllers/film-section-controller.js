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

const SHOWING_FILMS_COUNT_ON_START = 5;
const SHOWING_FILMS_COUNT_BY_BUTTON = 5;

const siteMainElement = document.querySelector(`.main`);

const sortOptions = generateSortOptions();
const sortComponent = new SortComponent(sortOptions);

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
  }

  render(films) {
    const renderShowMoreButton = (filmsArray) => {
      if (showingFilmsCount >= filmsArray.length) {
        return;
      }

      render(siteFilmsList, this._showMoreButtonComponent, RenderPosition.BEFOREEND);

      this._showMoreButtonComponent.setClickHandler(() => {
        const prevFilmsCount = showingFilmsCount;
        showingFilmsCount = showingFilmsCount + SHOWING_FILMS_COUNT_BY_BUTTON;

        filmsArray.slice(prevFilmsCount, showingFilmsCount).forEach((film) => {
          filmCardController.render(film);
        });

        if (showingFilmsCount >= filmsArray.length) {
          remove(this._showMoreButtonComponent);
        }
      });
    };

    const filterNumbers = findOutTheFilterNumbers(films);
    const filterOptions = generateFilterOptions(filterNumbers);

    render(siteMainElement, new FilterComponent(filterOptions), RenderPosition.BEFOREEND);
    render(this._container, sortComponent, RenderPosition.BEFOREEND);

    render(this._container, this._filmSection, RenderPosition.BEFOREEND);
    const siteFilms = document.querySelector(`.films`);

    if (films.length === 0) {
      render(siteFilms, this._failFilmSection, RenderPosition.BEFOREEND);
      return;
    }

    render(siteFilms, this._mainFilmSection, RenderPosition.BEFOREEND);
    const siteFilmsList = document.querySelector(`.films-list`);
    const siteFilmsListContainer = document.querySelector(`.films-list__container`);
    const filmCardController = new FilmCardController(siteFilmsListContainer);

    let showingFilmsCount = SHOWING_FILMS_COUNT_ON_START;

    films.slice(0, showingFilmsCount).forEach((film) => {
      filmCardController.render(film);
    });

    renderShowMoreButton(films);

    sortComponent.setSortTypeChangeHandler((sortType) => {
      showingFilmsCount = SHOWING_FILMS_COUNT_ON_START;
      const sortedFilms = getSortedFilms(films, sortType);

      siteFilmsListContainer.innerHTML = ``;

      sortedFilms.slice(0, showingFilmsCount).forEach((film) => {
        filmCardController.render(film);
      });

      renderShowMoreButton(sortedFilms);
    });
  }
}
