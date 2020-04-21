import {createElement} from "../utils.js";

const createShomMoreButton = () => {
  return (
    `<button class="films-list__show-more">Show more</button>`
  );
};

export default class ShomMoreButton {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createShomMoreButton();
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
