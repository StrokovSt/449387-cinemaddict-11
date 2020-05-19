import PopupComponent from "../components/film-popup.js";
import PopupCommentsComponent from "../components/film-popup-comments.js";

import CommentController from "../controllers/comment-controller.js";

import {RenderPosition, render, remove, replace} from "../utils/render.js";

import CommentsModel from "../models/comments.js";

const siteBodyElement = document.querySelector(`body`);

const renderComments = (commentContainer, comments, onCommentsDataChange) => {
  return comments.map((comment) => {
    const commentController = new CommentController(commentContainer, onCommentsDataChange);
    commentController.render(comment);

    return commentController;
  });
};

export default class PopupController {
  constructor(onDataChange, onViewChange, onPopupDataChange) {
    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;
    this._onPopupDataChange = onPopupDataChange;

    this._film = {};
    this._popupComponent = null;
    this._popupCommentsComponent = null;
    this._commentsModel = new CommentsModel();

    this._showedCommentsControllers = [];

    this._onEscKeyDown = this._onEscKeyDown.bind(this);
    this._onFilmDetailCloseButtonClick = this._onFilmDetailCloseButtonClick.bind(this);
    this._onCommentsDataChange = this._onCommentsDataChange.bind(this);
  }

  render(film) {
    this._film = film;

    const oldPopupComponent = this._popupComponent;
    this._popupComponent = new PopupComponent(this._film);

    if (oldPopupComponent) {
      replace(this._popupComponent, oldPopupComponent);
    } else {
      this._onViewChange();
      render(siteBodyElement, this._popupComponent, RenderPosition.BEFOREEND);
    }

    this._commentsModel.setComments(this._film.comments);
    const comments = this._commentsModel.getComments();

    this._popupCommentsComponent = new PopupCommentsComponent(this._film.comments);
    render(this._popupComponent.getPopupCommentsContainer(), this._popupCommentsComponent, RenderPosition.BEFOREEND);

    const newComments = renderComments(this._popupCommentsComponent.getPopupCommentsList(), comments, this._onCommentsDataChange);
    this._showedCommentsControllers = this._showedCommentsControllers.concat(newComments);

    //  Обработчики на попап

    this._popupComponent.setCloseButtonHandler(() => {
      this._onDataChange(this._film, this._film);
      this._onFilmDetailCloseButtonClick();
    });

    this._popupComponent.setWatclistClickHandler((evt) => {
      evt.preventDefault();
      this._onPopupDataChange(this._film, Object.assign({}, this._film, {
        watchlist: !this._film.watchlist
      }));
    });

    this._popupComponent.setWatchedClickHandler((evt) => {
      evt.preventDefault();
      this._onPopupDataChange(this._film, Object.assign({}, this._film, {
        alreadyWatched: !this._film.alreadyWatched
      }));
    });

    this._popupComponent.setFavoriteClickHandler((evt) => {
      evt.preventDefault();
      this._onPopupDataChange(this._film, Object.assign({}, this._film, {
        favorite: !this._film.favorite
      }));
    });

    //  Обработчики на комментарии

    this._popupCommentsComponent.setEmojiClickHandler((evt) => {
      if (evt.target.tagName !== `INPUT`) {
        return;
      }
      this._popupCommentsComponent.setNewCommentEmoji(evt.target.value);
      this._popupCommentsComponent.rerender();
    });

    document.addEventListener(`keydown`, this._onEscKeyDown);
  }

  _onCommentsDataChange(id, newComment) {
    if (newComment === null) {
      const isSuccess = this._commentsModel.deleteComment(id);
      if (isSuccess) {
        this._onPopupDataChange(this._film, Object.assign({}, this._film, {
          comments: this._commentsModel.getComments()
        }));
      }
    }
  }

  _onFilmDetailCloseButtonClick() {
    remove(this._popupComponent);
    document.removeEventListener(`keydown`, this._onEscKeyDown);
  }

  _onEscKeyDown(evt) {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;
    if (isEscKey) {
      remove(this._popupComponent);
    }
    this._onDataChange(this._film, this._film);
    document.removeEventListener(`keydown`, this._onEscKeyDown);
  }

  remove() {
    if (this._popupComponent) {
      remove(this._popupComponent);
      document.removeEventListener(`keydown`, this._onEscKeyDown);
    }
  }
}
