import ProfileComponent from "./components/profile.js";
import FilterComponent from "./components/filter.js";
import SortComponent from "./components/sort.js";
import FilmsSectionComponent from "./components/films-section.js";
import FilmsListSectionComponent from "./components/films-list-section.js";
import FilmsExtraSectionComponent from "./components/films-extra-section.js";
import FilmCardComponent from "./components/film-card.js";
import FilmDetailCardComponent from "./components/film-detail.js";
import ShomMoreButtonComponent from "./components/show-more-button.js";
import FooterStatiscticComponent from "./components/footer-statistic.js";

import {generateFilterOptions} from "./mock/mock-filter.js";
import {generateSortOptions} from "./mock/mock-sort.js";
import {generateFilms} from "./mock/mock-film.js";
import {RenderPosition, render, remove} from "./utils/render.js";

const FILMS_COUNT = 15;
const EXTRA_FILMS_COUNT = 2;
const SHOWING_FILMS_COUNT_ON_START = 5;
const SHOWING_FILMS_COUNT_BY_BUTTON = 5;

const siteHeaderElement = document.querySelector(`.header`);
const siteMainElement = document.querySelector(`.main`);
const siteFooterElement = document.querySelector(`.footer`);
const siteBodyElement = document.querySelector(`body`);

const films = generateFilms(FILMS_COUNT);

//  --------------------  Подсчет фильмов с категориями "watchlist", "history", "favorites"

const findOutTheFilterNumbers = (array) => {
  let watchNumber = 0;
  let historyNumber = 0;
  let favoritesNumber = 0;
  for (let i = 0; i < array.length; i++) {
    if (array[i].watchlist) {
      watchNumber++;
    }
    if (array[i].history) {
      historyNumber++;
    }
    if (array[i].favorites) {
      favoritesNumber++;
    }
  }
  const filterNumbers = [watchNumber, historyNumber, favoritesNumber];
  return filterNumbers;
};

const filterNumbers = findOutTheFilterNumbers(films);

const filterOptions = generateFilterOptions(filterNumbers);
const sortOptions = generateSortOptions();

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
  let showingFilmsCount = SHOWING_FILMS_COUNT_ON_START;

  filmsList.slice(0, showingFilmsCount).forEach((film) => {
    renderFilmCard(filmSectionElement, film);
  });

  const showMoreButton = new ShomMoreButtonComponent();
  showMoreButton.setClickHandler(() => {
    const prevFilmsCount = showingFilmsCount;
    showingFilmsCount = showingFilmsCount + SHOWING_FILMS_COUNT_BY_BUTTON;

    filmsList.slice(prevFilmsCount, showingFilmsCount).forEach((film) => {
      renderFilmCard(filmSectionElement, film);
    });

    if (showingFilmsCount >= filmsList.length) {
      remove(showMoreButton);
    }
  });

  render(siteFilmsList, showMoreButton, RenderPosition.BEFOREEND);
};

//  --------------------  Заполнение дополнительных секций «Top rated» и «Most commented»

const mostRatingFilms = films.slice().sort((a, b) => b.rating - a.rating);
const mostCommentedFilms = films.slice().sort((a, b) => b.commentsNumber - a.commentsNumber);

const renderExtraFilmsList = (filmSectionElement, filmsList, name) => {
  const filmExtraSection = new FilmsExtraSectionComponent(name);
  render(filmSectionElement, filmExtraSection, RenderPosition.BEFOREEND);
  const siteExtraFilmsContainer = filmExtraSection.getElement().querySelector(`.films-list__container`);

  filmsList.slice(0, EXTRA_FILMS_COUNT).forEach((film) => {
    renderFilmCard(siteExtraFilmsContainer, film);
  });
};

//  ---------------------------------------- Заполнение страницы контентом

render(siteHeaderElement, new ProfileComponent(), RenderPosition.BEFOREEND);
render(siteMainElement, new FilterComponent(filterOptions), RenderPosition.BEFOREEND);
render(siteMainElement, new SortComponent(sortOptions), RenderPosition.BEFOREEND);
render(siteMainElement, new FilmsSectionComponent(), RenderPosition.BEFOREEND);
render(siteFooterElement, new FooterStatiscticComponent(FILMS_COUNT), RenderPosition.BEFOREEND);

const siteFilms = document.querySelector(`.films`);

render(siteFilms, new FilmsListSectionComponent(), RenderPosition.BEFOREEND);
const siteFilmsList = document.querySelector(`.films-list`);
const siteFilmsListContainer = document.querySelector(`.films-list__container`);
renderFilmsList(siteFilmsListContainer, films);
renderExtraFilmsList(siteFilms, mostRatingFilms, `Top rated`);
renderExtraFilmsList(siteFilms, mostCommentedFilms, `Most commented`);
