import {createElement} from "../utils.js";

const createExtraFilmSectionTemplate = (name) => {
  return (
    `<section class="films-list--extra">
      <h2 class="films-list__title">${name}</h2>
      <div class="films-list__container"></div>
    </section>`
  );
};

export default class ExtraFilmSection {
  constructor(name) {
    this._name = name;
    this._element = null;
  }

  getTemplate() {
    return createExtraFilmSectionTemplate(this._name);
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
