import AbstractSmartComponent from "./abstract-smart-component.js";

const createFilmComments = (comments) => {
  return (
    `<section class="film-details__comments-wrap">
      <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${comments.length}</span></h3>
      <ul class="film-details__comments-list"></ul>
    </section>`
  );
};

export default class FilmPopupComments extends AbstractSmartComponent {
  constructor(comments) {
    super();
    this._comments = comments;
  }

  getTemplate() {
    return createFilmComments(this._comments);
  }

  getPopupCommentsList() {
    return this.getElement().querySelector(`.film-details__comments-list`);
  }
}
