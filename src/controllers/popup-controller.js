import FilmModel from "../models/film-adapter.js";
import PopupComponent from "../components/film-popup.js";
import PopupTypeControlsComponent from "../components/popop-type-controls.js";
import PopupCommentsComponent from "../components/popup-comments.js";
import PopupUserCommentComponent from "../components/popup-user-comment.js";
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
  constructor(onDataChange, onViewChange, onPopupDataChange, api) {
    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;
    this._onPopupDataChange = onPopupDataChange;
    this._api = api;

    this._film = {};
    this._comments = [];

    this._popupComponent = null;
    this._popupTypeControlsComponent = null;
    this._popupCommentsComponent = null;
    this._popupNewUserComponent = null;
    this._commentsModel = new CommentsModel();

    this._newText = null;
    this._showedCommentsControllers = [];

    this._onEscKeyDown = this._onEscKeyDown.bind(this);
    this._onPopupCloseButtonClick = this._onPopupCloseButtonClick.bind(this);
    this._onCommentsDataChange = this._onCommentsDataChange.bind(this);
  }

  render(film) {
    this._film = film;

    const oldPopupComponent = this._popupComponent;
    const oldPopupTypeControlsComponent = this._popupTypeControlsComponent;

    this._popupCommentsComponent = new PopupCommentsComponent(this._film.comments);
    this._popupTypeControlsComponent = new PopupTypeControlsComponent(this._film);

    if (oldPopupComponent) {
      replace(this._popupTypeControlsComponent, oldPopupTypeControlsComponent);
      const oldPopupUserCommentComponent = this._popupUserCommentComponent;
      replace(this._popupUserCommentComponent, oldPopupUserCommentComponent);
    } else {
      this._onViewChange();
      this._popupComponent = new PopupComponent(this._film);
      this._popupUserCommentComponent = new PopupUserCommentComponent(this._film.comments);
      render(siteBodyElement, this._popupComponent, RenderPosition.BEFOREEND);
      render(this._popupComponent.getPopupControlsContainer(), this._popupTypeControlsComponent, RenderPosition.BEFOREEND);
      render(this._popupComponent.getPopupCommentsContainer(), this._popupCommentsComponent, RenderPosition.BEFOREEND);
      render(this._popupComponent.getPopupCommentsContainer(), this._popupUserCommentComponent, RenderPosition.BEFOREEND);
    }

    this._api.getComments(this._film.id)
      .then((comments) => {
        this._commentsModel.setComments(comments);
      })
      .then(() => {
        this._comments = this._commentsModel.getComments();
        const newComments = renderComments(this._popupCommentsComponent.getPopupCommentsList(), this._comments, this._onCommentsDataChange);
        this._showedCommentsControllers = this._showedCommentsControllers.concat(newComments);
      });

    //  Обработчики на попап

    this._popupComponent.setCloseButtonHandler(() => {
      const newFilm = FilmModel.clone(this._film);
      this._onDataChange(this._film, newFilm);
      this._onPopupCloseButtonClick();
    });

    this._popupTypeControlsComponent.setWatchlistClickHandler((evt) => {
      evt.preventDefault();
      const newFilm = FilmModel.clone(this._film);
      newFilm.isInWatchlist = !newFilm.isInWatchlist;
      this._onPopupDataChange(this._film, newFilm);
    });

    this._popupTypeControlsComponent.setWatchedClickHandler((evt) => {
      evt.preventDefault();
      const newFilm = FilmModel.clone(this._film);
      newFilm.isWatched = !newFilm.isWatched;
      newFilm.watchingDate = new Date();
      this._onPopupDataChange(this._film, newFilm);
    });

    this._popupTypeControlsComponent.setFavoriteClickHandler((evt) => {
      evt.preventDefault();
      const newFilm = FilmModel.clone(this._film);
      newFilm.isFavorite = !newFilm.isFavorite;
      this._onPopupDataChange(this._film, newFilm);
    });

    //  Обработчики на комментарии

    this._popupUserCommentComponent.setChangeEmojiClickHandler((evt) => {
      if (evt.target.tagName !== `INPUT`) {
        return;
      }
      this._popupUserCommentComponent.setUserCommentEmojiImg(evt.target.value);
      this._popupUserCommentComponent.rerender();
    });

    this._popupUserCommentComponent.setUserCommentInputChangeHandler((evt) => {
      if (evt.target.tagName !== `TEXTAREA`) {
        return;
      }
      this._popupUserCommentComponent.setUserCommentText(evt.target.value);
    });

    this._popupUserCommentComponent.setSubmitHandler(this._onCommentsDataChange);

    document.addEventListener(`keydown`, this._onEscKeyDown);
  }

  _onCommentsDataChange(id, newComment) {
    if (newComment === null) {
      const isSuccess = this._commentsModel.deleteComment(id);
    } else if (id === null) {
      this._commentsModel.addComment(newComment);
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
      const newFilm = FilmModel.clone(this._film);
      this._onDataChange(this._film, newFilm);
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
