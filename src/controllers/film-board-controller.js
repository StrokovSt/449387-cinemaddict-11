import SortComponent from "../components/sort.js";
import MainFilmSectionComponent from "../components/films-list-section.js";
import ShomMoreButtonComponent from "../components/show-more-button.js";
import FilmsExtraSectionComponent from "../components/films-extra-section.js";

import FilmCardController from "../controllers/film-card-controller.js";

import {SortTypes} from "../const.js";
import {RenderPosition, render, remove, replace} from "../utils/render.js";

const DEFAULT_FILMS_COUNT = 5;
const DEFAULT_EXTRA_FILMS_COUNT = 2;

const getSortedFilms = (films, sortType, from, to) => {
  let sortedFilms = [];
  const choosenFilms = films.slice();
  switch (sortType) {
    case SortTypes.DEFAULT:
      sortedFilms = choosenFilms;
      break;
    case SortTypes.SORT_BY_DATE:
      sortedFilms = choosenFilms.sort((a, b) => b.releaseDate - a.releaseDate);
      break;
    case SortTypes.SORT_BY_RATING:
      sortedFilms = choosenFilms.sort((a, b) => b.rating - a.rating);
      break;
  }

  return sortedFilms.slice(from, to);
};

const renderFilms = (filmListContainer, films, ondataChange, onViewChange, onPopupDataChange, api) => {
  return films.map((film) => {
    const filmController = new FilmCardController(filmListContainer, ondataChange, onViewChange, onPopupDataChange, api);
    filmController.render(film);

    return filmController;
  });
};

export default class FilmsSectionListController {
  constructor(container, filmModel, api) {
    this._container = container;
    this._filmModel = filmModel;
    this._api = api;

    this._showedFilmsControllers = [];

    this._mainFilmSection = new MainFilmSectionComponent();
    this._topRatedFilmsExtraSection = new FilmsExtraSectionComponent(`Top rated`);
    this._topCommentedFilmsExtraSection = new FilmsExtraSectionComponent(`Top commented`);
    this._showMoreButtonComponent = new ShomMoreButtonComponent();
    this._sortComponent = new SortComponent();
    this._showingFilmsCount = DEFAULT_FILMS_COUNT;
    this._filmListContainer = null;

    this._onDataChange = this._onDataChange.bind(this);
    this._onPopupDataChange = this._onPopupDataChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);
    this._onSortTypeChange = this._onSortTypeChange.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);

    this._sortComponent.setSortTypeChangeHandler(this._onSortTypeChange);
    this._filmModel.setFilterChangeHandler(this._onFilterChange);
  }

  render() {
    const container = this._container.getElement();
    const films = this._filmModel.getFilteredFilms();
    const sortedFilms = getSortedFilms(films, this._sortComponent.getSortType(), 0, this._showingFilmsCount);

    render(container, this._sortComponent, RenderPosition.BEFOREEND);

    const oldMainFilmSection = this._mainFilmSection;
    this._mainFilmSection = new MainFilmSectionComponent(films.length !== 0);

    if (oldMainFilmSection) {
      replace(this._mainFilmSection, oldMainFilmSection);
    }
    render(container, this._mainFilmSection, RenderPosition.BEFOREEND);

    this._filmListContainer = this._mainFilmSection.getContainerElement();
    this._mainFilmListSection = document.querySelector(`.films-list`);

    const newFilms = renderFilms(this._filmListContainer, sortedFilms.slice(0, this._showingFilmsCount), this._onDataChange, this._onViewChange, this._onPopupDataChange, this._api);
    this._showedFilmsControllers = this._showedFilmsControllers.concat(newFilms);
    this._renderShowMoreButton();

    // рендер двух самых рейтинговых фильмов

    const topRatedFilms = this._filmModel.getTopRatedFilms();

    if (topRatedFilms.length > 0) {
      render(container, this._topRatedFilmsExtraSection, RenderPosition.BEFOREEND);
      const newTopRatedFilms = renderFilms(this._topRatedFilmsExtraSection.getContainerElement(), topRatedFilms.slice(0, DEFAULT_EXTRA_FILMS_COUNT), this._onDataChange, this._onViewChange, this._onPopupDataChange, this._api);
      this._showedFilmsControllers = this._showedFilmsControllers.concat(newTopRatedFilms);
    }

    // рендер двух самых комментированных фильмов

    const topCommentedFilms = this._filmModel.getTopCommentedFilms();

    if (topRatedFilms.length > 0) {
      render(container, this._topCommentedFilmsExtraSection, RenderPosition.BEFOREEND);
      const newTopCommetnedFilms = renderFilms(this._topCommentedFilmsExtraSection.getContainerElement(), topCommentedFilms.slice(0, DEFAULT_EXTRA_FILMS_COUNT), this._onDataChange, this._onViewChange, this._onPopupDataChange, this._api);
      this._showedFilmsControllers = this._showedFilmsControllers.concat(newTopCommetnedFilms);
    }
  }

  hide() {
    this._container.hide();
    this._sortComponent.setSortTypeToDefault();
    this._onSortTypeChange(SortTypes.DEFAULT);
  }

  show() {
    this._container.show();
  }

  _onDataChange(oldData, newData) {
    const changeFilm = () => {
      const isSuccess = this._filmModel.updateFilm(oldData.id, newData);
      if (isSuccess) {
        this._removeFilms();
        this.render();
        this._showedFilmsControllers.forEach((it) => {
          if (it._film === oldData) {
            it.render(newData);
          }
        });
      }
    };

    changeFilm();
  }

  _onPopupDataChange(oldData, newData) {
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
    const films = this._filmModel.getFilteredFilms();
    remove(this._showMoreButtonComponent);

    if (this._showingFilmsCount >= films.length) {
      return;
    }

    render(this._mainFilmListSection, this._showMoreButtonComponent, RenderPosition.BEFOREEND);

    this._showMoreButtonComponent.setClickHandler(() => {
      const prevFilmsCount = this._showingFilmsCount;
      this._showingFilmsCount += DEFAULT_FILMS_COUNT;

      const sortedFilms = getSortedFilms(films, this._sortComponent.getSortType(), prevFilmsCount, this._showingFilmsCount);
      const newFilms = renderFilms(this._filmListContainer, sortedFilms, this._onDataChange, this._onViewChange, this._onPopupDataChange, this._api);

      this._showedFilmsControllers = this._showedFilmsControllers.concat(newFilms);

      if (this._showingFilmsCount >= films.length) {
        remove(this._showMoreButtonComponent);
      }
    });
  }

  _onSortTypeChange(sortType) {
    const films = this._filmModel.getFilteredFilms();
    this._showingFilmsCount = DEFAULT_FILMS_COUNT;
    const sortedFilms = getSortedFilms(films, sortType, 0, this._showingFilmsCount);

    this._filmListContainer.innerHTML = ``;

    const newFilms = renderFilms(this._filmListContainer, sortedFilms, this._onDataChange, this._onViewChange, this._onPopupDataChange, this._api);
    this._showedFilmsControllers = this._showedFilmsControllers.concat(newFilms);

    this._renderShowMoreButton();
  }

  _onViewChange() {
    this._showedFilmsControllers.forEach((it) => it.setDefaultView());
  }

  _removeFilms() {
    this._showedFilmsControllers.forEach((it) => it.destroy());
    this._showedFilmsControllers = [];
  }

  _updateCards() {
    this._removeFilms();
    this._container.innerHTML = ``;
    this._showingFilmsCount = DEFAULT_FILMS_COUNT;
    this.render();
  }

  _onFilterChange() {
    this._sortComponent.setSortTypeToDefault();
    this._updateCards();
  }
}
