import AbstractComponent from "./abstract-component.js";

const sortTypes = {
  DEFAULT: `default`,
  SORT_BY_DATE: `by date`,
  SORT_BY_RATING: `by rating`
};

const createSortOption = (sortValue, isActive) => {
  const {name, sortType} = sortValue;
  return (
    `<li>
      <a href="#" data-sort-type="${sortType}" class="sort__button ${isActive ? `sort__button--active` : ``}">${name}</a>
    </li>`
  );
};

const createSort = (options) => {
  const sortOptions = options.map((it, i) => createSortOption(it, i === 0)).join(`\n`);
  return (
    `<ul class="sort">
      ${sortOptions}
    </ul>`
  );
};

export default class Sort extends AbstractComponent {
  constructor(sorts) {
    super();
    this._sorts = sorts;
    this._currentSort = sortTypes.DEFAULT;
  }

  getTemplate() {
    return createSort(this._sorts);
  }

  getSortType() {
    return this._currentSort;
  }

  setSortTypeChangeHandler() {
    this.getElement().addEventListener(`click`, (evt) => {
      const sortTypeValue = evt.target.dataset.sortType;
      console.log(sortTypeValue);
    });
  }
}
