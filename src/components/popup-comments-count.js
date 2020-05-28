import AbstractSmartComponent from "./abstract-smart-component.js";

const createFilmCommentsCount = (comments) => {
  return (
    `<h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${comments.length}</span></h3>`
  );
};

export default class FilmPopupCommentsCount extends AbstractSmartComponent {
  constructor(comments) {
    super();
    this._comments = comments;
  }

  getTemplate() {
    return createFilmCommentsCount(this._comments);
  }

  rerender(comments) {
    this._comments = comments;
    super.rerender();
  }

  recoveryListeners() {}
}
