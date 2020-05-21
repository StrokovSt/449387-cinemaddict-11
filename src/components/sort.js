import AbstractComponent from './abstract-component.js';

import {SortTypes} from "../const.js";

const createSortOption = (sortType, name, isActive) => {
  return (
    `<li>
      <a href='#' data-sort-type='${sortType}' class='sort__button ${isActive ? `sort__button--active` : ``}'>${name}</a>
    </li>`
  );
};

const createSort = () => {
  return (
    `<ul class='sort'>
      ${createSortOption(SortTypes.DEFAULT, `Sort by default`, true)}
      ${createSortOption(SortTypes.SORT_BY_DATE, `Sort by date`, false)}
      ${createSortOption(SortTypes.SORT_BY_RATING, `Sort by rating`, false)}
    </ul>`
  );
};

export default class Sort extends AbstractComponent {
  constructor() {
    super();
    this._currentSortType = SortTypes.DEFAULT;
  }

  getTemplate() {
    return createSort();
  }

  getSortType() {
    return this._currentSortType;
  }

  setSortTypeToDefault() {
    this.removeActiveClass();
    this._currentSortType = SortTypes.DEFAULT;
    this.addActiveClass();
  }

  removeActiveClass() {
    this.getElement().querySelector(`[data-sort-type='${this._currentSortType}']`).classList.remove(`sort__button--active`);
  }

  addActiveClass() {
    this.getElement().querySelector(`[data-sort-type = '${this._currentSortType}']`).classList.add(`sort__button--active`);
  }

  setSortTypeChangeHandler(handler) {
    this.getElement().addEventListener(`click`, (evt) => {
      this.removeActiveClass();
      const sortTypeValue = evt.target.dataset.sortType;
      this._currentSortType = sortTypeValue;
      handler(this._currentSortType);
      this.addActiveClass();
    });
  }
}
