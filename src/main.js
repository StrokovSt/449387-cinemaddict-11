import ProfileComponent from "./components/profile.js";
import FooterStatiscticComponent from "./components/footer-statistic.js";

import {generateFilms} from "./mock/mock-film.js";
import {RenderPosition, render} from "./utils/render.js";

import FilmsSectionListController from "./controllers/film-section-controller.js";
import FilmsExtraSectionListController from "./controllers/film-extra-section-controller.js";

const FILMS_COUNT = 10;

const siteHeaderElement = document.querySelector(`.header`);
const siteMainElement = document.querySelector(`.main`);
const siteFooterElement = document.querySelector(`.footer`);

const films = generateFilms(FILMS_COUNT);

//  ---------------------------------------- Заполнение страницы контентом

render(siteHeaderElement, new ProfileComponent(), RenderPosition.BEFOREEND);
render(siteFooterElement, new FooterStatiscticComponent(FILMS_COUNT), RenderPosition.BEFOREEND);

const filmsListController = new FilmsSectionListController(siteMainElement);
filmsListController.render(films);

const siteFilms = document.querySelector(`.films`);

if (films.length !== 0) {
  const mostRatingFilms = films.slice().sort((a, b) => b.rating - a.rating);
  const mostCommentedFilms = films.slice().sort((a, b) => b.commentsNumber - a.commentsNumber);

  const filmsExtraListController = new FilmsExtraSectionListController(siteFilms);
  filmsExtraListController.render(mostRatingFilms, `Top rated`);
  filmsExtraListController.render(mostCommentedFilms, `Most commented`);
}
