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

export {createSort};
