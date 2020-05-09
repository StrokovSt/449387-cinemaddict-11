import AbstractComponent from "./abstract-component.js";

export const sortTypes = {
  DEFAULT: `default`,
  SORT_BY_DATE: `by date`,
  SORT_BY_RATING: `by rating`
};

const createSortOption = (sortType, name, isActive) => {
  return (
    `<li>
      <a href="#" data-sort-type="${sortType}" class="sort__button ${isActive ? `sort__button--active` : ``}">${name}</a>
    </li>`
  );
};

const createSort = () => {
  return (
    `<ul class="sort">
      ${createSortOption(sortTypes.DEFAULT, `Sort by default`, true)}
      ${createSortOption(sortTypes.SORT_BY_DATE, `Sort by date`, false)}
      ${createSortOption(sortTypes.SORT_BY_RATING, `Sort by rating`, false)}
    </ul>`
  );
};

export default class Sort extends AbstractComponent {
  constructor() {
    super();
    this._currentSortType = sortTypes.DEFAULT;
  }

  getTemplate() {
    return createSort();
  }

  getSortType() {
    return this._currentSortType;
  }

  setSortTypeChangeHandler(handler) {
    this.getElement().addEventListener(`click`, (evt) => {
      const sortTypeValue = evt.target.dataset.sortType;
      this._currentSortType = sortTypeValue;
      handler(this._currentSortType);
    });
  }
}
