const optionNames = [
  `Sort by default`, `Sort by date`, `Sort by rating`
];

const generateSortOptions = () => {
  return optionNames.map((it) => {
    return {
      name: it
    };
  });
};

export {generateSortOptions};
