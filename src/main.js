import ProfileComponent from "./components/profile.js";
import FooterStatiscticComponent from "./components/footer-statistic.js";
import FilmsModle from "./models/films.js";

import {generateFilms} from "./mock/mock-film.js";
import {RenderPosition, render} from "./utils/render.js";

import FilmsBoardController from "./controllers/film-board-controller.js";

const FILMS_COUNT = 10;

const siteHeaderElement = document.querySelector(`.header`);
const siteMainElement = document.querySelector(`.main`);
const siteFooterElement = document.querySelector(`.footer`);

const films = generateFilms(FILMS_COUNT);
const filmModel = new FilmsModle();
filmModel.setFilms(films);

//  ---------------------------------------- Заполнение страницы контентом

render(siteHeaderElement, new ProfileComponent(), RenderPosition.BEFOREEND);
render(siteFooterElement, new FooterStatiscticComponent(FILMS_COUNT), RenderPosition.BEFOREEND);

const filmsListController = new FilmsBoardController(siteMainElement, filmModel);
filmsListController.render(films);
