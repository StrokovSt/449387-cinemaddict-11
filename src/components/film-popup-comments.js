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

const createFilmComments = (comments, selectedEmoji) => {
  const emojiOptions = generateEmojiOptions(EMOJI_NAMES, selectedEmoji);

  return (
    `<section class="film-details__comments-wrap">
      <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${comments.length}</span></h3>
      <ul class="film-details__comments-list">
      </ul>
      <div class="film-details__new-comment">
        <div for="add-emoji" class="film-details__add-emoji-label">
          <img src="./images/emoji/${selectedEmoji}.png" width="55" height="55" alt="emoji-${selectedEmoji}">
        </div>
        <label class="film-details__comment-label">
          <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment"></textarea>
        </label>
        <div class="film-details__emoji-list">
          ${emojiOptions}
        </div>
      </div>
    </section>`
  );
};

export default class FilmPopupComments extends AbstractSmartComponent {
  constructor(comments) {
    super();

    this._comments = comments;
    this._selectedEmoji = `smile`;
    this._emojiClickHandler = null;

    this.recoveryListeners();
  }

  rerender() {
    super.rerender();
  }

  getTemplate() {
    return createFilmComments(this._comments, this._selectedEmoji);
  }

  getPopupCommentsList() {
    return this.getElement().querySelector(`.film-details__comments-list`);
  }

  setEmojiClickHandler(handler) {
    this.getElement().querySelector(`.film-details__emoji-list`).addEventListener(`click`, handler);
    this._emojiClickHandler = handler;
  }

  setNewCommentEmoji(emoji) {
    this._selectedEmoji = emoji;
  }

  recoveryListeners() {
    this.setEmojiClickHandler(this._emojiClickHandler);
  }
}
