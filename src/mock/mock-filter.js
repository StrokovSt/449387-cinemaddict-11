const filterNames = [
  `Watchlist`, `History`, `Favorites`
];

const generateFilterOptions = (numbers) => {
  return filterNames.map((it, i) => {
    return {
      name: it,
      count: numbers[i],
    };
  });
};

export {generateFilterOptions};
