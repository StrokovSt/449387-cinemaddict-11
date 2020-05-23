import ProfileComponent from "../components/profile.js";
import {RenderPosition, render, replace} from "../utils/render.js";

export default class ProfileController {
  constructor(container, filmModel) {
    this._container = container;
    this._filmModel = filmModel;

    this._profileComponent = null;

    this._onDataChange = this._onDataChange.bind(this);
    this._filmModel.setDataChangeHandler(this._onDataChange);
  }

  render() {
    const watchedMoviesCount = this._filmModel.getWatchedFilms().length;
    const oldComponent = this._profileComponent;
    this._profileComponent = new ProfileComponent(watchedMoviesCount);

    if (oldComponent) {
      replace(this._profileComponent, oldComponent);
    } else {
      render(this._container, this._profileComponent, RenderPosition.BEFOREEND);
    }
  }

  _onDataChange() {
    this.render();
  }
}
