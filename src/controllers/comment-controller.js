import PopupCommentComponent from "../components/popup-comment.js";

import {RenderPosition, render, remove} from "../utils/render.js";

export default class CommentController {
  constructor(container, onCommentsDataChange) {
    this._container = container;
    this._onCommentsDataChange = onCommentsDataChange;

    this._comment = {};
    this._commentId = null;
    this._commentComponent = null;
  }

  render(comment) {
    this._comment = comment;
    this._commentId = this._comment.id;
    this._commentComponent = new PopupCommentComponent(this._comment);
    render(this._container, this._commentComponent, RenderPosition.BEFOREEND);

    this._commentComponent.setDeleteButtonClickHandler((evt) => {
      evt.preventDefault();
      this._onCommentsDataChange(this._commentId, null);
      remove(this._commentComponent);
    });
  }
}
