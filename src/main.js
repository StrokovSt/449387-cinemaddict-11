import API from "./api.js";

import FilmsSectionComponent from "./components/films-section.js";
import MainStatisticComponent from "./components/statistic.js";
import FooterStatiscticComponent from "./components/footer-statistic.js";

import FilmsModel from "./models/films.js";
import {RenderPosition, render} from "./utils/render.js";

import FilmsBoardController from "./controllers/film-board-controller.js";
import FilterController from "./controllers/filter-controller.js";
import ProfileController from "./controllers/profile-controller.js";

const FILMS_COUNT = 25;

const siteHeaderElement = document.querySelector(`.header`);
const siteMainElement = document.querySelector(`.main`);
const siteFooterElement = document.querySelector(`.footer`);

const filmModel = new FilmsModel();

const AUTHORIZATION = `Basic meowbeautikey-dsadfgmdhgkn12l3gh`;
const END_POINT = `https://11.ecmascript.pages.academy/cinemaddict`;
const api = new API(END_POINT, AUTHORIZATION);

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
const filterController = new FilterController(siteMainElement, filmModel, onScreenChangeHandler);
const filmsBoardController = new FilmsBoardController(filmsSectionComponent, filmModel, api);
const profileController = new ProfileController(siteHeaderElement, filmModel);

profileController.render();
filterController.render();

render(siteMainElement, filmsSectionComponent, RenderPosition.BEFOREEND);
render(siteMainElement, mainStatisticComponent, RenderPosition.BEFOREEND);
mainStatisticComponent.hide();



api.getFilms()
  .then((films) => {
    filmModel.setFilms(films);
    filmsBoardController.render();
    const footerStatiscticComponent = new FooterStatiscticComponent(filmModel.getFilms().length);
    render(siteFooterElement, footerStatiscticComponent, RenderPosition.BEFOREEND);
  });
