import {userRanks} from "../const.js";

export const createRank = (watchedFilmsCount) => {
  let userRank = ``;
  if (watchedFilmsCount <= 10 && watchedFilmsCount >= 0) {
    userRank = userRanks[0];
  } else
  if (watchedFilmsCount <= 20 && watchedFilmsCount >= 11) {
    userRank = userRanks[1];
  } else
  if (watchedFilmsCount >= 21) {
    userRank = userRanks[2];
  }
  return userRank;
};
