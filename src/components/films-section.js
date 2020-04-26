import AbstractComponent from "./abstract-component.js";

const createFilmsSectionTemplate = () => {
  return (
    `<section class="films"></section>`
  );
};

export default class FilmSection extends AbstractComponent {
  getTemplate() {
    return createFilmsSectionTemplate();
  }
}
