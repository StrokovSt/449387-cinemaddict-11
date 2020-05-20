import AbstractComponent from "./abstract-component.js";

const createMainFilmSectionTemplate = (isFilmsExist) => {
  const sectionTitle = isFilmsExist ? `All movies. Upcoming` : `There are no movies in our database`;
  return (
    `<section class="films-list">
       <h2 class="films-list__title ${isFilmsExist ? `visually-hidden` : ``}">${sectionTitle}</h2>
       <div class="films-list__container"></div>
     </section>`
  );
};

export default class MainFilmSectionComponent extends AbstractComponent {
  constructor(isFilmsExist) {
    super();
    this._isFilmsExist = isFilmsExist;
  }

  getTemplate() {
    return createMainFilmSectionTemplate(this._isFilmsExist);
  }

  getContainerElement() {
    return this.getElement().querySelector(`.films-list__container`);
  }
}
