import FilmsSectionComponent from "./components/films-section.js";
import MainStatisticComponent from "./components/statistic.js";
import FooterStatiscticComponent from "./components/footer-statistic.js";

import FilmsModel from "./models/films.js";
import {generateFilms} from "./mock/mock-film.js";
import {RenderPosition, render} from "./utils/render.js";

import FilmsBoardController from "./controllers/film-board-controller.js";
import FilterController from "./controllers/filter-controller.js";
import ProfileController from "./controllers/profile-controller.js";

const FILMS_COUNT = 25;

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
    filterController.removeActiveClass();
  } else if (!isStatsOn) {
    filmsBoardController.show();
    mainStatisticComponent.hide();
  }
};

//  ---------------------------------------- Заполнение страницы контентом

const filmsSectionComponent = new FilmsSectionComponent();
const mainStatisticComponent = new MainStatisticComponent(filmModel);
const footerStatiscticComponent = new FooterStatiscticComponent(FILMS_COUNT);
const filterController = new FilterController(siteMainElement, filmModel, onScreenChangeHandler);
const filmsBoardController = new FilmsBoardController(filmsSectionComponent, filmModel);
const profileController = new ProfileController(siteHeaderElement, filmModel);

profileController.render();
filterController.render();

render(siteMainElement, filmsSectionComponent, RenderPosition.BEFOREEND);
render(siteMainElement, mainStatisticComponent, RenderPosition.BEFOREEND);
mainStatisticComponent.hide();
filmsBoardController.render(films);
render(siteFooterElement, footerStatiscticComponent, RenderPosition.BEFOREEND);
