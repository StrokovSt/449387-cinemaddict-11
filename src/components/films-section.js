import {createElement} from "../utils.js";

const createFilmsSectionTemplate = () => {
  return (
    `<section class="films"></section>`
  );
};

export default class FilmSection {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createFilmsSectionTemplate();
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
