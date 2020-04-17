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

const createFilter = (filters) => {
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

export {createFilter};
