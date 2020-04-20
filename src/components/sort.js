import {createElement} from "../utils.js";

const createSortOption = (sortValue, isActive) => {
  const {name} = sortValue;
  return (`
    <li>
      <a href="#" class="sort__button ${isActive ? `sort__button--active` : ``}">${name}</a>
    </li>
  `);
};

const createSort = (options) => {
  const sortOptions = options.map((it, i) => createSortOption(it, i === 0)).join(`\n`);
  return (`
    <ul class="sort">
      ${sortOptions}
    </ul>
  `);
};

export default class Sort {
  constructor(sorts) {
    this._sorts = sorts;
    this._element = null;
  }

  getTemplate() {
    return createSort(this._sorts);
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
