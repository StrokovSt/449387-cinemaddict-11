import PopupComponent from "../components/film-popup.js";
import PopupCommentsComponent from "../components/popup-comments.js";
import PopupTypeControlsComponent from "../components/popop-type-controls.js";

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
    this._popupTypeControlsComponent = null;
    this._commentsModel = new CommentsModel();

    this._newText = null;

    this._showedCommentsControllers = [];

    this._onEscKeyDown = this._onEscKeyDown.bind(this);
    this._onPopupCloseButtonClick = this._onPopupCloseButtonClick.bind(this);
    this._onCommentsDataChange = this._onCommentsDataChange.bind(this);
  }

  render(film) {
    this._film = film;
    this._commentsModel.setComments(this._film.comments);
    const comments = this._commentsModel.getComments();

    const oldPopupComponent = this._popupComponent;
    const oldPopupCommentsComponent = this._popupCommentsComponent;
    const oldPopupTypeControlsComponent = this._popupTypeControlsComponent;

    this._popupTypeControlsComponent = new PopupTypeControlsComponent(this._film);
    this._popupCommentsComponent = new PopupCommentsComponent(comments);

    if (oldPopupComponent) {
      replace(this._popupTypeControlsComponent, oldPopupTypeControlsComponent);
      replace(this._popupCommentsComponent, oldPopupCommentsComponent);
    } else {
      this._onViewChange();
      this._popupComponent = new PopupComponent(this._film);
      render(siteBodyElement, this._popupComponent, RenderPosition.BEFOREEND);
      render(this._popupComponent.getPopupControlsContainer(), this._popupTypeControlsComponent, RenderPosition.BEFOREEND);
      render(this._popupComponent.getPopupCommentsContainer(), this._popupCommentsComponent, RenderPosition.BEFOREEND);
    }

    const newComments = renderComments(this._popupCommentsComponent.getPopupCommentsList(), comments, this._onCommentsDataChange);
    this._showedCommentsControllers = this._showedCommentsControllers.concat(newComments);

    //  Обработчики на попап

    this._popupComponent.setCloseButtonHandler(() => {
      this._onDataChange(this._film, this._film);
      this._onPopupCloseButtonClick();
    });

    this._popupTypeControlsComponent.setWatchlistClickHandler((evt) => {
      evt.preventDefault();
      this._onPopupDataChange(this._film, Object.assign({}, this._film, {
        watchlist: !this._film.watchlist
      }));
    });

    this._popupTypeControlsComponent.setWatchedClickHandler((evt) => {
      evt.preventDefault();
      if (this._film.watchingDate === undefined) {
        this._onPopupDataChange(this._film, Object.assign({}, this._film, {
          alreadyWatched: !this._film.alreadyWatched,
          watchingDate: new Date(),
        }));
      } else {
        this._onPopupDataChange(this._film, Object.assign({}, this._film, {
          alreadyWatched: !this._film.alreadyWatched,
          watchingDate: undefined,
        }));
      }
    });

    this._popupTypeControlsComponent.setFavoriteClickHandler((evt) => {
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
      renderComments(this._popupCommentsComponent.getPopupCommentsList(), comments, this._onCommentsDataChange);
    });

    this._popupCommentsComponent.setTextChangeHandler((evt) => {
      if (evt.target.tagName !== `TEXTAREA`) {
        return;
      }
      this._popupCommentsComponent.setNewCommentText(evt.target.value);
    });

    this._popupCommentsComponent.setSubmitHandler(this._onCommentsDataChange);

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
    } else if (id === null) {
      this._commentsModel.addComment(newComment);
      this._onPopupDataChange(this._film, Object.assign({}, this._film, {
        comments: this._commentsModel.getComments()
      }));
    }
  }

  _onPopupCloseButtonClick() {
    remove(this._popupComponent);
    document.removeEventListener(`keydown`, this._onEscKeyDown);
  }

  _onEscKeyDown(evt) {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;
    if (isEscKey) {
      remove(this._popupComponent);
      this._onDataChange(this._film, this._film);
      document.removeEventListener(`keydown`, this._onEscKeyDown);
    }
  }

  remove() {
    if (this._popupComponent) {
      remove(this._popupComponent);
      document.removeEventListener(`keydown`, this._onEscKeyDown);
    }
  }
}
