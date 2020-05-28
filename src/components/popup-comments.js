import AbstractSmartComponent from "./abstract-smart-component.js";

const createFilmComments = () => {
  return (
    `<section class="film-details__comments-wrap">
      <ul class="film-details__comments-list"></ul>
    </section>`
  );
};

export default class FilmPopupComments extends AbstractSmartComponent {
  constructor() {
    super();
  }

  getTemplate() {
    return createFilmComments();
  }

  getPopupCommentsList() {
    return this.getElement().querySelector(`.film-details__comments-list`);
  }
}
