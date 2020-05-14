import FilterComponent from "../components/filter.js";

import {FilterTypes} from "../const.js";

import {RenderPosition, render, replace} from "../utils/render.js";
import {getFilmsByFilter} from "../utils/filter.js";

export default class FilterController {
  constructor(container, filmModel) {
    this._container = container;
    this._filmModel = filmModel;

    this._activeFilterType = FilterTypes.ALL;
    this._filterComponent = null;

    this._onDataChange = this._onDataChange.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);

    this._filmModel.setDataChangeHandler(this._onDataChange);
  }

  render() {
    const container = this._container;
    const allFilms = this._filmModel.getFilms();

    const filters = Object.values(FilterTypes).map((filterType) => {
      return {
        name: filterType,
        count: getFilmsByFilter(filterType, allFilms).length,
        checked: filterType === this._activeFilterType,
      };
    });

    const oldFilterComponent = this._filterComponent;
    this._filterComponent = new FilterComponent(filters);

    if (oldFilterComponent) {
      replace(this._filterComponent, oldFilterComponent);
    }
    render(container, this._filterComponent, RenderPosition.AFTERBEGIN);

    this._filterComponent.setFilterTypeChangeHandler(this._onFilterChange);
  }

  _onDataChange() {
    this.render();
  }

  _onFilterChange(filterType) {
    this._filmModel.setFilter(filterType);
    this._activeFilterType = filterType;
    this.render();
  }

}
