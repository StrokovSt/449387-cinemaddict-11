import FilmsExtraSectionComponent from "../components/films-extra-section.js";
import FilmCardController from "../controllers/film-card-controller.js";

import {RenderPosition, render} from "../utils/render.js";

const EXTRA_FILMS_COUNT = 2;

//  --------------------  Заполнение дополнительных секций «Top rated» и «Most commented»

const renderExtraFilmsList = (filmSectionElement, films, name) => {
  const filmExtraSection = new FilmsExtraSectionComponent(name);
  render(filmSectionElement, filmExtraSection, RenderPosition.BEFOREEND);
  const siteExtraFilmsContainer = filmExtraSection.getElement().querySelector(`.films-list__container`);
  const filmCardController = new FilmCardController(siteExtraFilmsContainer);

  films.slice(0, EXTRA_FILMS_COUNT).forEach((film) => {
    filmCardController.render(film);
  });
};

export default class FilmsExtraSectionListController {
  constructor(container) {
    this._container = container;
    this.films = [];
  }

  render(films, name) {
    this.films = films;
    renderExtraFilmsList(this._container, this.films, name);
  }
}
