import SortComponent from "../components/sort.js";
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
const sort = new SortComponent(sortOptions);

//  -------------------- Рендер карточек в основной список фильмов

const renderMainFilmSection = (filmSectionElement, films) => {

  const showMoreButton = new ShomMoreButtonComponent();

  const renderShowMoreButton = () => {
    if (showingFilmsCount >= films.length) {
      return;
    }

    render(siteFilmsList, showMoreButton, RenderPosition.BEFOREEND);

    showMoreButton.setClickHandler(() => {
      const prevFilmsCount = showingFilmsCount;
      showingFilmsCount = showingFilmsCount + SHOWING_FILMS_COUNT_BY_BUTTON;

      films.slice(prevFilmsCount, showingFilmsCount).forEach((film) => {
        filmCardController.render(film);
      });

      if (showingFilmsCount >= films.length) {
        remove(showMoreButton);
      }
    });
  };

  const findOutTheFilterNumbers = () => {
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

  const filterNumbers = findOutTheFilterNumbers(films);
  const filterOptions = generateFilterOptions(filterNumbers);

  render(siteMainElement, new FilterComponent(filterOptions), RenderPosition.BEFOREEND);
  render(filmSectionElement, sort, RenderPosition.BEFOREEND);
  sort.setSortTypeChangeHandler();

  render(filmSectionElement, new FilmsSectionComponent(), RenderPosition.BEFOREEND);
  const siteFilms = document.querySelector(`.films`);

  if (films.length === 0) {
    render(siteFilms, new FailFilmSectionComponent(), RenderPosition.BEFOREEND);
    return;
  }

  render(siteFilms, new MainFilmSectionComponent(), RenderPosition.BEFOREEND);
  const siteFilmsList = document.querySelector(`.films-list`);
  const siteFilmsListContainer = document.querySelector(`.films-list__container`);
  const filmCardController = new FilmCardController(siteFilmsListContainer);

  let showingFilmsCount = SHOWING_FILMS_COUNT_ON_START;

  films.slice(0, showingFilmsCount).forEach((film) => {
    filmCardController.render(film);
  });

  renderShowMoreButton();
};

export default class FilmsSectionListController {
  constructor(container) {
    this._container = container;
  }

  render(films) {
    renderMainFilmSection(this._container, films);
  }
}
