import SortComponent, {sortTypes} from "../components/sort.js";
import FilmsSectionComponent from "../components/films-section.js";
import MainFilmSectionComponent from "../components/films-list-section.js";
import FailFilmSectionComponent from "../components/films-fail-section.js";
import ShomMoreButtonComponent from "../components/show-more-button.js";
import FilmsExtraSectionComponent from "../components/films-extra-section.js";

import FilmCardController from "../controllers/film-card-controller.js";

import {RenderPosition, render, remove} from "../utils/render.js";

const DEFAULT_FILMS_COUNT = 5;

const getSortedFilms = (films, sortType, from, to) => {
  let sortedFilms = [];
  const choosenFilms = films.slice();
  switch (sortType) {
    case sortTypes.DEFAULT:
      sortedFilms = choosenFilms;
      break;
    case sortTypes.SORT_BY_DATE:
      sortedFilms = choosenFilms.sort((a, b) => b.date - a.date);
      break;
    case sortTypes.SORT_BY_RATING:
      sortedFilms = choosenFilms.sort((a, b) => b.rating - a.rating);
      break;
  }

  return sortedFilms.slice(from, to);
};

const renderFilms = (filmListContainer, films, ondataChange, onViewChange) => {
  return films.map((film) => {
    const filmController = new FilmCardController(filmListContainer, ondataChange, onViewChange);
    filmController.render(film);

    return filmController;
  });
};

export default class FilmsSectionListController {
  constructor(container, filmModel) {
    this._container = container;
    this._filmModel = filmModel;

    this._films = [];
    this._topRatedFilms = [];
    this._showedFilmsControllers = [];

    this._filmsSection = new FilmsSectionComponent();
    this._failFilmSection = new FailFilmSectionComponent();
    this._mainFilmSection = new MainFilmSectionComponent();
    this._showMoreButtonComponent = new ShomMoreButtonComponent();
    this._sortComponent = new SortComponent();
    this._showingFilmsCount = DEFAULT_FILMS_COUNT;
    this._filmListContainer = null;
    this._mainFilmsSection = null;

    this._onDataChange = this._onDataChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);
    this._onSortTypeChange = this._onSortTypeChange.bind(this);

    this._sortComponent.setSortTypeChangeHandler(this._onSortTypeChange);
  }

  render() {
    const films = this._filmModel.getFilms();

    render(this._container, this._sortComponent, RenderPosition.BEFOREEND);
    render(this._container, this._filmsSection, RenderPosition.BEFOREEND);
    const filmsSection = document.querySelector(`.films`);

    if (films.length === 0) {
      render(filmsSection, this._failFilmSection, RenderPosition.BEFOREEND);
      return;
    }

    render(filmsSection, this._mainFilmSection, RenderPosition.BEFOREEND);
    this._filmListContainer = document.querySelector(`.films-list__container`);
    this._mainFilmsSection = document.querySelector(`.films-list`);

    const newFilms = renderFilms(this._filmListContainer, films.slice(0, this._showingFilmsCount), this._onDataChange, this._onViewChange);
    this._showedFilmsControllers = this._showedFilmsControllers.concat(newFilms);
    this._renderShowMoreButton();

    // рендер дополнительных бордов с фильмами

    this._topRatedFilms = films.slice().sort((a, b) => b.rating - a.rating);

    const topRatingExtraSection = new FilmsExtraSectionComponent(`Top rated`);
    render(filmsSection, topRatingExtraSection, RenderPosition.BEFOREEND);
    const topRatingFilmsContainer = topRatingExtraSection.getElement().querySelector(`.films-list__container`);

    const topRatingFilms = renderFilms(topRatingFilmsContainer, this._topRatedFilms.slice(0, 2), this._onDataChange, this._onViewChange);
    this._showedFilmsControllers = this._showedFilmsControllers.concat(topRatingFilms);
  }

  _onDataChange(oldData, newData) {
    const isSuccess = this._filmModel.updateFilm(oldData.id, newData);

    if (isSuccess) {
      this._showedFilmsControllers.forEach((it) => {
        if (it._film === oldData) {
          it.render(newData);
        }
      });
    }
  }

  _renderShowMoreButton() {
    const films = this._filmModel.getFilms();
    remove(this._showMoreButtonComponent);
    if (this._showingFilmsCount >= films.length) {
      return;
    }

    render(this._mainFilmsSection, this._showMoreButtonComponent, RenderPosition.BEFOREEND);

    this._showMoreButtonComponent.setClickHandler(() => {
      const prevFilmsCount = this._showingFilmsCount;
      this._showingFilmsCount += DEFAULT_FILMS_COUNT;

      const sortedFilms = getSortedFilms(films, this._sortComponent.getSortType(), prevFilmsCount, this._showingFilmsCount);
      const newFilms = renderFilms(this._filmListContainer, sortedFilms, this._onDataChange, this._onViewChange);

      this._showedFilmsControllers = this._showedFilmsControllers.concat(newFilms);

      if (this._showingFilmsCount >= films.length) {
        remove(this._showMoreButtonComponent);
      }
    });
  }

  _onSortTypeChange(sortType) {
    const films = this._filmModel.getFilms();
    this._showingFilmsCount = DEFAULT_FILMS_COUNT;
    const sortedFilms = getSortedFilms(films, sortType, 0, this._showingFilmsCount);

    this._filmListContainer.innerHTML = ``;

    const newFilms = renderFilms(this._filmListContainer, sortedFilms, this._onDataChange, this._onViewChange);
    this._showedFilmsControllers = this._showedFilmsControllers.concat(newFilms);

    this._renderShowMoreButton();
  }

  _onViewChange() {
    this._showedFilmsControllers.forEach((it) => it.setDefaultView());
  }
}
