import AbstractComponent from "./abstract-component.js";

const createFilterOption = (filter) => {
  let {name, count, checked} = filter;
  return (
    `<a href="#${name}" data-type="${name}" class="main-navigation__item ${checked ? `main-navigation__item--active` : ``}">
      ${name}
      <span class="main-navigation__item-count ${name === `All movies` ? `visually-hidden` : ``}">${count}</span>
    </a>`
  );
};

const createFilterTemplate = (filters, isStatsOn) => {
  const filterMarkup = filters.map((filter) => {
    return createFilterOption(filter);
  }).join(`\n`);
  return (
    `<nav class="main-navigation">
      <div class="main-navigation__items">
        ${filterMarkup}
      </div>
      <a href="#stats" class="main-navigation__additional ${isStatsOn ? `main-navigation__additional--active` : ``}">Stats</a>
    </nav>`
  );
};

export default class Filter extends AbstractComponent {
  constructor(filters, isStatsOn) {
    super();
    this._filters = filters;
    this._currentFilterType = ``;
    this._isStatsOn = isStatsOn;
  }

  getTemplate() {
    return createFilterTemplate(this._filters, this._isStatsOn);
  }

  setFilterTypeChangeHandler(handler) {
    this.getElement().addEventListener(`click`, (evt) => {
      evt.preventDefault();
      if (evt.target.tagName === `A`) {
        const linkHref = evt.target.href.slice().split(`#`)[1];
        if (linkHref === `stats`) {
          return;
        }
        const filterType = evt.target.dataset.type;
        this._currentFilterType = filterType;
        handler(this._currentFilterType);
      }
    });
  }

  setStatsChangeHandler(handler) {
    this.getElement().addEventListener(`click`, (evt) => {
      evt.preventDefault();
      if (evt.target.tagName === `A`) {
        const linkHref = evt.target.href.slice().split(`#`)[1];
        if (linkHref === `stats`) {
          this._isStatsOn = true;
          handler(this._isStatsOn);
        } else if (linkHref !== `stats`) {
          this._isStatsOn = false;
          handler(this._isStatsOn);
        }
      }
    });
  }
}
