import {getRandomIntegerNumber, getRandomArrayItem, getRandomMixedArray} from "../utils.js";
import {filmNames, filmGenres, filmDescriptions, ratingList, filmDirectors, filmWriters, filmActors, monthNames, countryNames} from "../const.js";
import {generateComments} from "./mock-comment.js";

//  ------------------------  Данные для карточки фильма

const generateFilm = () => {
  const filmName = getRandomArrayItem(filmNames);
  const hourDuration = getRandomIntegerNumber(1, 4);
  const minuteDuration = getRandomIntegerNumber(0, 59);

  const data = new Date();
  data.setFullYear(getRandomIntegerNumber(1940, 2020), getRandomIntegerNumber(0, 11), getRandomIntegerNumber(0, 31));

  const filmDescription = getRandomMixedArray(filmDescriptions, getRandomIntegerNumber(1, 6)).reduce(function (sum, current) {
    return sum + current + ` `;
  });

  const genrys = getRandomMixedArray(filmGenres, getRandomIntegerNumber(1, 4));

  return {
    title: filmName,
    rating: `${getRandomIntegerNumber(0, 10)}.${getRandomIntegerNumber(0, 10)}`,
    year: data.getFullYear(),
    mounth: data.getDate() + ` ` + monthNames[data.getMonth()],
    duration: `${hourDuration}h ${minuteDuration}m`,
    genry: genrys,
    img: `./images/posters/${filmName}.jpg`,
    description: filmDescription,
    commentsNumber: getRandomIntegerNumber(0, 200),
    pg: getRandomArrayItem(ratingList),
    director: getRandomArrayItem(filmDirectors),

    writers: getRandomMixedArray(filmWriters, getRandomIntegerNumber(1, 5)).reduce(function (sum, current) {
      return sum + `, ` + current;
    }),

    actors: getRandomMixedArray(filmActors, getRandomIntegerNumber(1, 10)).reduce(function (sum, current) {
      return sum + `, ` + current;
    }),

    country: getRandomArrayItem(countryNames),
    comments: generateComments(getRandomIntegerNumber(1, 10)),

    watchlist: Math.random() > 0.5,
    history: Math.random() > 0.5,
    favorites: Math.random() > 0.5
  };
};

const generateFilms = (count) => {
  return new Array(count)
    .fill(``)
    .map(generateFilm);
};

export {generateFilm, generateFilms};
