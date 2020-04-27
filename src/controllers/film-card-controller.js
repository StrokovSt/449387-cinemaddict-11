import FilmCardComponent from "../components/film-card.js";
import FilmDetailCardComponent from "../components/film-detail.js";

import {RenderPosition, render, remove} from "../utils/render.js";

const siteBodyElement = document.querySelector(`body`);

//  -------------------- Рендер карточки фильма

const renderFilmCard = (filmSectionElement, film) => {
  const onFilmCardClick = (evt) => {
    if (evt.target.classList.contains(`film-card__title`) || evt.target.classList.contains(`film-card__poster`)
    || evt.target.classList.contains(`film-card__comments`)) {
      render(siteBodyElement, filmDetailCard, RenderPosition.BEFOREEND);
      document.addEventListener(`keydown`, onEscKeyDown);

      filmDetailCard.setCloseButtonHandler(() => {
        onFilmDetailCloseButtonClick();
      });
    }
  };

  const onFilmDetailCloseButtonClick = () => {
    remove(filmDetailCard);
    document.removeEventListener(`keydown`, onEscKeyDown);
  };

  const onEscKeyDown = (evt) => {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

    if (isEscKey) {
      remove(filmDetailCard);
      document.removeEventListener(`keydown`, onEscKeyDown);
    }
  };

  const filmCard = new FilmCardComponent(film);
  const filmDetailCard = new FilmDetailCardComponent(film);

  filmCard.setFilmClickHandler((evt) => {
    onFilmCardClick(evt);
  });

  render(filmSectionElement, filmCard, RenderPosition.BEFOREEND);
};

export default class FilmCardController {
  constructor(container) {
    this._container = container;
  }

  render(film) {
    renderFilmCard(this._container, film);
  }
}
