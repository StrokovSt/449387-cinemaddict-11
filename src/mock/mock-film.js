import {getRandomIntegerNumber, getRandomArrayItem, getRandomMixedArray} from "../utils/auxiliary-functions.js";
import {filmNames, filmGenres, filmDescriptions, ratingList, filmDirectors, filmWriters, filmActors, countryNames} from "../const.js";
import {generateComments} from "./mock-comment.js";

//  ------------------------  Данные для карточки фильма

const generateFilm = (item, id) => {
  const filmName = getRandomArrayItem(filmNames);
  const minuteDuration = getRandomIntegerNumber(90, 210);

  const newDate = new Date();
  newDate.setFullYear(getRandomIntegerNumber(1940, 2020), getRandomIntegerNumber(0, 12), getRandomIntegerNumber(0, 31));

  const newWatchedDate = new Date();
  newWatchedDate.setFullYear(getRandomIntegerNumber(2020, 2020), getRandomIntegerNumber(4, 6), getRandomIntegerNumber(0, 31));

  const filmDescription = getRandomMixedArray(filmDescriptions, getRandomIntegerNumber(1, 6)).reduce(function (sum, current) {
    return sum + current + ` `;
  });

  const genres = getRandomMixedArray(filmGenres, getRandomIntegerNumber(1, 5));
  const alreadyWatched = Math.random() > 0.5;

  return {
    id,
    comments: generateComments(getRandomIntegerNumber(1, 10)),
    title: filmName,
    originalTitle: filmName,
    rating: `${getRandomIntegerNumber(0, 10)}.${getRandomIntegerNumber(0, 10)}`,
    poster: `./images/posters/${filmName}.jpg`,
    ageRating: getRandomArrayItem(ratingList),
    director: getRandomArrayItem(filmDirectors),
    writers: getRandomMixedArray(filmWriters, getRandomIntegerNumber(1, 5)).reduce(function (sum, current) {
      return sum + `, ` + current;
    }),
    actors: getRandomMixedArray(filmActors, getRandomIntegerNumber(1, 10)).reduce(function (sum, current) {
      return sum + `, ` + current;
    }),
    releaseDate: newDate,
    duration: minuteDuration,
    country: getRandomArrayItem(countryNames),
    genre: genres,
    description: filmDescription,
    isInWatchlist: Math.random() > 0.5,
    isWatched: alreadyWatched,
    isFavorite: Math.random() > 0.5,
    watchingDate: alreadyWatched ? newWatchedDate : undefined,
  };
};

const generateFilms = (count) => {
  return new Array(count)
    .fill(``)
    .map(generateFilm);
};

export {generateFilm, generateFilms};
