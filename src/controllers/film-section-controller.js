import FilmsListSectionComponent from "../components/films-list-section.js";
import FilmsFailSectionComponent from "../components/films-fail-section.js";

import FilmCardComponent from "../components/film-card.js";
import FilmDetailCardComponent from "../components/film-detail.js";
import ShomMoreButtonComponent from "../components/show-more-button.js";

import {RenderPosition, render, remove} from "../utils/render.js";

const SHOWING_FILMS_COUNT_ON_START = 5;
const SHOWING_FILMS_COUNT_BY_BUTTON = 5;

const siteHeaderElement = document.querySelector(`.header`);
const siteMainElement = document.querySelector(`.main`);
const siteFooterElement = document.querySelector(`.footer`);
const siteBodyElement = document.querySelector(`body`);

//  -------------------- Рендер карточки фильма

const renderFilmCard = (filmSectionElement, film) => {
  const onFilmCardClick = (evt) => {
    if (evt.target.classList.contains(`film-card__title`) || evt.target.classList.contains(`film-card__poster`)
    || evt.target.classList.contains(`film-card__comments`)) {
      render(siteBodyElement, filmDetailCard, RenderPosition.BEFOREEND);
      document.addEventListener(`keydown`, onEscKeyDown);

      filmDetailCard.setCloseButtonHandler(() => {
        onFilmDetailCloseButtonClick();
      });
    }
  };

  const onFilmDetailCloseButtonClick = () => {
    remove(filmDetailCard);
    document.removeEventListener(`keydown`, onEscKeyDown);
  };

  const onEscKeyDown = (evt) => {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

    if (isEscKey) {
      remove(filmDetailCard);
      document.removeEventListener(`keydown`, onEscKeyDown);
    }
  };

  const filmCard = new FilmCardComponent(film);
  const filmDetailCard = new FilmDetailCardComponent(film);

  filmCard.setFilmClickHandler((evt) => {
    onFilmCardClick(evt);
  });

  render(filmSectionElement, filmCard, RenderPosition.BEFOREEND);
};

//  -------------------- Рендер карточек в основной список фильмов

const renderFilmsList = (filmSectionElement, filmsList) => {
  const siteFilms = document.querySelector(`.films`);

  render(siteFilms, new FilmsListSectionComponent(), RenderPosition.BEFOREEND);
  const siteFilmsList = document.querySelector(`.films-list`);
  const siteFilmsListContainer = document.querySelector(`.films-list__container`);

  let showingFilmsCount = SHOWING_FILMS_COUNT_ON_START;

  filmsList.slice(0, showingFilmsCount).forEach((film) => {
    renderFilmCard(siteFilmsListContainer, film);
  });

  const showMoreButton = new ShomMoreButtonComponent();
  showMoreButton.setClickHandler(() => {
    const prevFilmsCount = showingFilmsCount;
    showingFilmsCount = showingFilmsCount + SHOWING_FILMS_COUNT_BY_BUTTON;

    filmsList.slice(prevFilmsCount, showingFilmsCount).forEach((film) => {
      renderFilmCard(siteFilmsListContainer, film);
    });

    if (showingFilmsCount >= filmsList.length) {
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
    renderFilmsList(this._container, films);
  }
}
