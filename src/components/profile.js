import AbstractComponent from "./abstract-component.js";
import {userRanks} from "../const.js";

const createRank = (watchedFilmsCount) => {
  let userRank = ``;
  if (watchedFilmsCount <= 10 && watchedFilmsCount > 0) {
    userRank = userRanks[0];
  } else
  if (watchedFilmsCount <= 20 && watchedFilmsCount > 11) {
    userRank = userRanks[1];
  } else
  if (watchedFilmsCount > 21) {
    userRank = userRanks[2];
  }
  return userRank;
};

const createProfileTemplate = (watchedFilmsCount) => {
  const userRank = createRank(watchedFilmsCount);
  return (
    `<section class="header__profile profile">
      <p class="profile__rating">${userRank}</p>
      <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
    </section>`
  );
};

export default class Profile extends AbstractComponent {
  constructor(watchedFilmsCount) {
    super();
    this.watchedFilmsCount = watchedFilmsCount;
  }

  getTemplate() {
    return createProfileTemplate(this.watchedFilmsCount);
  }
}
