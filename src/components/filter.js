import AbstractComponent from "./abstract-component.js";

const createFilterOption = (name, count) => {
  return (
    `<a href="#${name}" class="main-navigation__item">
      ${name}
      <span class="main-navigation__item-count">
        ${count}
      </span>
    </a>`
  );
};

const createFilterTemplate = (watchlistCount, historyCount, favoritesCount) => {
  return (
    `<nav class="main-navigation">
      <div class="main-navigation__items">
        <a href="#all" class="main-navigation__item main-navigation__item--active">All movies</a>
        ${createFilterOption(`Watchlist`, watchlistCount)}
        ${createFilterOption(`History`, historyCount)}
        ${createFilterOption(`Favorites`, favoritesCount)}
      </div>
      <a href="#stats" class="main-navigation__additional">Stats</a>
    </nav>`
  );
};

export default class Filter extends AbstractComponent {
  constructor(watchlistCount, historyCount, favoritesCount) {
    super();
    this._watchlistCount = watchlistCount;
    this._historyCount = historyCount;
    this._favoritesCount = favoritesCount;
  }

  getTemplate() {
    return createFilterTemplate(this._watchlistCount, this._historyCount, this._favoritesCount);
  }
}
