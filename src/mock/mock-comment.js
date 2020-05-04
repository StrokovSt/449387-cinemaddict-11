import {getRandomArrayItem} from "../utils/auxiliary-functions.js";
import {filmComments, userList, commentTime, commentEmoji} from "../const.js";

const generateComment = () => {
  const emoji = getRandomArrayItem(commentEmoji);
  return {
    text: getRandomArrayItem(filmComments),
    autor: getRandomArrayItem(userList),
    date: getRandomArrayItem(commentTime),
    emoji: `${emoji}`,
    img: `./images/emoji/${emoji}.png`,
  };
};

const generateComments = (count) => {
  return new Array(count)
    .fill(``)
    .map(generateComment);
};

export {generateComment, generateComments};
