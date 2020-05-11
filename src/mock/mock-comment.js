import {getRandomArrayItem} from "../utils/auxiliary-functions.js";
import {filmComments, userList, commentEmoji} from "../const.js";
import {getRandomIntegerNumber} from "../utils/auxiliary-functions.js";

const generateComment = () => {
  const emoji = getRandomArrayItem(commentEmoji);

  const newDate = new Date();
  newDate.setFullYear(getRandomIntegerNumber(2019, 2020), getRandomIntegerNumber(0, 12), getRandomIntegerNumber(0, 28));
  newDate.setHours(getRandomIntegerNumber(11, 24));

  return {
    autor: getRandomArrayItem(userList),
    comment: getRandomArrayItem(filmComments),
    date: newDate,
    emotion: `${emoji}`,
  };
};

const generateComments = (count) => {
  return new Array(count)
    .fill(``)
    .map(generateComment);
};

export {generateComment, generateComments};
