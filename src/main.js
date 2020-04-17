import {createProfileTemplate} from "./components/profile.js";
import {createFilter} from "./components/filter.js";
import {generateFilterOptions} from "./mock/mock-filter.js";
import {createSort} from "./components/sort.js";
import {generateSortOptions} from "./mock/mock-sort.js";
import {createFilmsSectionTemplate} from "./components/film-section.js";
import {createFilmCardTemplate} from "./components/film-card.js";
import {generateFilms} from "./mock/mock-film.js";
import {createFilmDetailPopup} from "./components/film-detail.js";
import {createShomMoreButton} from "./components/show-more-button.js";
import {createFooterStatiscticTemplate} from "./components/footer-statistic.js";


const FILMS_COUNT = 15;
const EXTRA_FILMS_COUNT = 2;
const SHOWING_FILMS_COUNT_ON_START = 5;
const SHOWING_FILMS_COUNT_BY_BUTTON = 5;

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

const siteHeaderElement = document.querySelector(`.header`);
const siteMainElement = document.querySelector(`.main`);
const siteFooterElement = document.querySelector(`.footer`);

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

//  -------------------- Заполнение страницы контентом

render(siteHeaderElement, createProfileTemplate(), `beforeend`);
const filterOptions = generateFilterOptions(filterNumbers);
render(siteMainElement, createFilter(filterOptions), `beforeend`);
const sortOptions = generateSortOptions();
render(siteMainElement, createSort(sortOptions), `beforeend`);
render(siteMainElement, createFilmsSectionTemplate(), `beforeend`);
render(siteFooterElement, createFooterStatiscticTemplate(), `beforeend`);

const siteFilmsList = document.querySelector(`.films-list`);
const siteFilmsListContainer = document.querySelector(`.films-list__container`);
const siteExtraFilmsArray = document.querySelectorAll(`.films-list--extra`);

//  -------------------- Добавление карточек фильмов

let showingFilmsCount = SHOWING_FILMS_COUNT_ON_START;

for (let i = 0; i < showingFilmsCount; i++) {
  render(siteFilmsListContainer, createFilmCardTemplate(films[i]), `beforeend`);
}

render(siteFilmsList, createShomMoreButton(), `beforeend`);
const showMoreButton = siteFilmsList.querySelector(`.films-list__show-more`);

showMoreButton.addEventListener(`click`, () => {
  const prevFilmsCount = showingFilmsCount;
  showingFilmsCount = showingFilmsCount + SHOWING_FILMS_COUNT_BY_BUTTON;

  films.slice(prevFilmsCount, showingFilmsCount)
    .forEach((film) => render(siteFilmsListContainer, createFilmCardTemplate(film), `beforeend`));

  if (showingFilmsCount >= films.length) {
    showMoreButton.remove();
  }
});

//  --------------------  Заполнение дополнительных секций «Top rated» и «Most commented»

const mostRatingFilms = films.slice().sort((a, b) => b.rating - a.rating);
const mostCommentedFilms = films.slice().sort((a, b) => b.comments - a.comments);

for (let i = 0; i < siteExtraFilmsArray.length; i++) {
  for (let j = 0; j < EXTRA_FILMS_COUNT; j++) {
    const film = i === 0 ? mostRatingFilms[j] : mostCommentedFilms[j];
    render(siteExtraFilmsArray[i].querySelector(`.films-list__container`), createFilmCardTemplate(film), `beforeend`);
  }
}

//  --------------------  Добавление попапа

render(siteFooterElement, createFilmDetailPopup(films[0]), `afterend`);
const filmdDetailsPopup = document.querySelector(`.film-details`);
const filmdDetailCloseButton = filmdDetailsPopup.querySelector(`.film-details__close-btn`);

filmdDetailCloseButton.addEventListener(`click`, () => {
  filmdDetailsPopup.remove();
});
