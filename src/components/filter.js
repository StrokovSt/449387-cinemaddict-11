import {createElement} from "../utils.js";

const createFilterOption = (mockFilter) => {
  const {name, count} = mockFilter;
  return (`
    <a href="#${name}" class="main-navigation__item">
      ${name}
      <span class="main-navigation__item-count">
        ${count}
      </span>
    </a>
  `);
};

const createFilterTemplate = (filters) => {
  const filtersOptions = filters.map((it) => createFilterOption(it)).join(`\n`);
  return (`
    <nav class="main-navigation">
      <div class="main-navigation__items">
        <a href="#all" class="main-navigation__item main-navigation__item--active">All movies</a>
        ${filtersOptions}
      </div>
      <a href="#stats" class="main-navigation__additional">Stats</a>
    </nav>
  `);
};

export default class Filter {
  constructor(filters) {
    this._filters = filters;
    this._element = null;
  }

  getTemplate() {
    return createFilterTemplate(this._filters);
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
