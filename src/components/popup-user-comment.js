import {encode} from "he";
import AbstractSmartComponent from "./abstract-smart-component.js";

const EMOJI_NAMES = [
  `smile`,
  `sleeping`,
  `puke`,
  `angry`,
];

const createEmojiOption = (emojiName, selectedEmojiName) => {
  const checkControl = (emojiName === selectedEmojiName) ? `checked` : ``;
  return (
    `<input class="film-details__emoji-item visually-hidden" name="comment-${emojiName}" type="radio" id="emoji-${emojiName}" value="${emojiName}" ${checkControl}>
    <label class="film-details__emoji-label" for="emoji-${emojiName}">
      <img src="./images/emoji/${emojiName}.png" width="30" height="30" alt="emoji">
    </label>`
  );
};

const generateEmojiOptions = (emojiNames, selectedEmoji) => {
  const emojiMurkup = emojiNames.map((emojiName) => `${createEmojiOption(emojiName, selectedEmoji)}`).join(`\n`);
  return emojiMurkup;
};

const createUserComment = (selectedEmoji, newCommentText) => {
  const encodeNewCommentText = encode(newCommentText);
  const emojiOptions = generateEmojiOptions(EMOJI_NAMES, selectedEmoji);

  return (
    `<div class="film-details__new-comment">
      <div for="add-emoji" class="film-details__add-emoji-label">
        <img src="./images/emoji/${selectedEmoji}.png" width="55" height="55" alt="emoji-${selectedEmoji}">
      </div>
      <label class="film-details__comment-label">
        <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment">${encodeNewCommentText}</textarea>
      </label>
      <div class="film-details__emoji-list">
        ${emojiOptions}
      </div>
    </div>`
  );
};

export default class PopupUserComment extends AbstractSmartComponent {
  constructor(comments) {
    super();

    this._changeEmojiHandler = null;
    this._changeNewCommentHandler = null;
    this._submitHandler = null;
    this._comments = comments;

    this._selectedEmoji = EMOJI_NAMES[0];
    this._newCommentText = ``;
  }

  getTemplate() {
    return createUserComment(this._selectedEmoji, this._newCommentText);
  }

  setChangeEmojiClickHandler(handler) {
    this.getElement().querySelector(`.film-details__emoji-list`).addEventListener(`click`, handler);
    this._changeEmojiHandler = handler;
  }

  setUserCommentInputChangeHandler(handler) {
    this.getElement().querySelector(`.film-details__comment-input`).addEventListener(`keyup`, handler);
    this.getElement().querySelector(`.film-details__comment-input`).focus({preventScroll: true});
    this._changeNewCommentHandler = handler;
  }

  setSubmitHandler(handler) {
    this.getElement().querySelector(`.film-details__comment-input`).addEventListener(`keydown`, (evt) => {
      if (evt.target.value !== ``) {
        const isKey = (evt.key === `Enter` && (evt.ctrlKey || evt.metaKey));
        if (isKey) {
          handler(null, Object.assign({}, {
            id: this._comments.length + 1,
            author: `Korovka Meowsky`,
            comment: this._newCommentText,
            date: new Date(),
            emotion: this._selectedEmoji,
          }));
        }
      }
    });
    this._submitHandler = handler;
  }

  setUserCommentText(text) {
    this._newCommentText = text;
  }

  setUserCommentEmojiImg(emoji) {
    this._selectedEmoji = emoji;
  }

  recoveryListeners() {
    this.setChangeEmojiClickHandler(this._changeEmojiHandler);
    this.setUserCommentInputChangeHandler(this._changeNewCommentHandler);
    this.setSubmitHandler(this._submitHandler);
  }
}
