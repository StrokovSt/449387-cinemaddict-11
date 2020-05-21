import FilmsSectionComponent from "./components/films-section.js";
import ProfileComponent from "./components/profile.js";
import MainStatisticComponent from "./components/statistic.js";
import FooterStatiscticComponent from "./components/footer-statistic.js";
import FilmsModel from "./models/films.js";

import {generateFilms} from "./mock/mock-film.js";
import {RenderPosition, render} from "./utils/render.js";

import FilmsBoardController from "./controllers/film-board-controller.js";
import FilterController from "./controllers/filter-controller.js";

const FILMS_COUNT = 10;

const siteHeaderElement = document.querySelector(`.header`);
const siteMainElement = document.querySelector(`.main`);
const siteFooterElement = document.querySelector(`.footer`);

const films = generateFilms(FILMS_COUNT);
const filmModel = new FilmsModel();
filmModel.setFilms(films);

//  ---------------------------------------- Логика переключения экранов

const onScreenChangeHandler = (isStatsOn) => {
  if (isStatsOn) {
    mainStatisticComponent.show();
    filmsBoardController.hide();
  } else if (!isStatsOn) {
    filmsBoardController.show();
    mainStatisticComponent.hide();
  }
}

//  ---------------------------------------- Заполнение страницы контентом

const filmsSectionComponent = new FilmsSectionComponent();
const mainStatisticComponent = new MainStatisticComponent(filmModel);
const footerStatiscticComponent = new FooterStatiscticComponent(FILMS_COUNT);
const filterController = new FilterController(siteMainElement, filmModel, onScreenChangeHandler);
const watchedFilmsCount = filterController.getWatchedFilmsCount();
const filmsBoardController = new FilmsBoardController(filmsSectionComponent, filmModel);
const profileComponent = new ProfileComponent(watchedFilmsCount);

filterController.render();
render(siteHeaderElement, filmsSectionComponent, RenderPosition.BEFOREEND);
render(siteMainElement, filmsSectionComponent, RenderPosition.BEFOREEND);
render(siteMainElement, mainStatisticComponent, RenderPosition.BEFOREEND);
mainStatisticComponent.hide();
filmsBoardController.render(films);
render(siteFooterElement, footerStatiscticComponent, RenderPosition.BEFOREEND);
