import MainFilmSectionComponent from "../components/films-list-section.js";
import FailFilmSectionComponent from "../components/films-fail-section.js";
import ShomMoreButtonComponent from "../components/show-more-button.js";
import FilmCardController from "../controllers/film-card-controller.js";

import {RenderPosition, render, remove} from "../utils/render.js";

const SHOWING_FILMS_COUNT_ON_START = 5;
const SHOWING_FILMS_COUNT_BY_BUTTON = 5;

//  -------------------- Рендер карточек в основной список фильмов

const renderMainFilmSection = (filmSectionElement, films) => {
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

  const showMoreButton = new ShomMoreButtonComponent();
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

  render(siteFilmsList, showMoreButton, RenderPosition.BEFOREEND);
};

export default class FilmsSectionListController {
  constructor(container) {
    this._container = container;
  }

  render(films) {
    renderMainFilmSection(this._container, films);
  }
}
