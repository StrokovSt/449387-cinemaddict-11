const optionNames = [
  `Sort by default`, `Sort by date`, `Sort by rating`, `Sort by meow`
];

const generateSortOptions = () => {
  return optionNames.map((it) => {
    return {
      name: it
    };
  });
};

export {generateSortOptions};
