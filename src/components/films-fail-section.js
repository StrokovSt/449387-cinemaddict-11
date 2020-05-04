import AbstractComponent from "./abstract-component.js";

const createFailFilmSectionTemplate = () => {
  return (
    `<section class="films-list">
      <h2 class="films-list__title">There are no movies in our database</h2>
    </section>`
  );
};

export default class FailFilmSectionComponent extends AbstractComponent {
  getTemplate() {
    return createFailFilmSectionTemplate();
  }
}
