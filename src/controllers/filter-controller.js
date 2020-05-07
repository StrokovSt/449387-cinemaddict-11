import FilterComponent from "../components/filter.js";

import {RenderPosition, render, remove, replace} from "../utils/render.js";

export default class FilterController {
  constructor(container) {
    this._container = container;

    this._filterComponent = null;
  }

  render(watchlistCount, historyCount, favoritesCount) {
    this._filterComponent = new FilterComponent(watchlistCount, historyCount, favoritesCount);
    render(this._container, this._filterComponent, RenderPosition.BEFOREEND);
  }
}
