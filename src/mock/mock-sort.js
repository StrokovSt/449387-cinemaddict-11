const optionNames = [`Sort by default`, `Sort by date`, `Sort by rating`];

const sortTypes = [`default`, `by date`, `by rating`];

const generateSortOptions = () => {
  return optionNames.map((it, i) => {
    return {
      name: it,
      sortType: sortTypes[i]
    };
  });
};

export {generateSortOptions};
