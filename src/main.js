import {createProfileTemplate} from "./components/profile.js";
import {createMainNavigationTemplate} from "./components/main-navigation.js";
import {createSortTemplate} from "./components/sort.js";
import {createFilmsSectionTemplate} from "./components/film-section.js";
import {createFilmCardTemplate} from "./components/film-card.js";
import {createShomMoreButton} from "./components/show-more-button.js";
import {createFooterStatiscticTemplate} from "./components/footer-statistic.js";

const FILMS_COUNT = 5;
const EXTRA_FILMS_COUNT = 2;

const siteHeaderElement = document.querySelector(`.header`);
const siteMainElement = document.querySelector(`.main`);
const siteFooterElement = document.querySelector(`.footer`);

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

render(siteHeaderElement, createProfileTemplate(), `beforeend`);
render(siteMainElement, createMainNavigationTemplate(), `beforeend`);
render(siteMainElement, createSortTemplate(), `beforeend`);
render(siteMainElement, createFilmsSectionTemplate(), `beforeend`);
render(siteFooterElement, createFooterStatiscticTemplate(), `beforeend`);

const siteFilmsList = document.querySelector(`.films-list`);
const siteFilmsListContainer = document.querySelector(`.films-list__container`);
const siteExtraFilmsArray = document.querySelectorAll(`.films-list--extra`);

for (let i = 0; i < FILMS_COUNT; i++) {
  render(siteFilmsListContainer, createFilmCardTemplate(), `beforeend`);
}

render(siteFilmsList, createShomMoreButton(), `beforeend`);

for (let i = 0; i < siteExtraFilmsArray.length; i++) {
  for (let j = 0; j < EXTRA_FILMS_COUNT; j++) {
    render(siteExtraFilmsArray[i].querySelector(`.films-list__container`), createFilmCardTemplate(), `beforeend`);
  }
}
