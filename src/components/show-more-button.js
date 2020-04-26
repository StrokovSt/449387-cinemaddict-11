import AbstractComponent from "./abstract-component.js";

const createShomMoreButton = () => {
  return (
    `<button class="films-list__show-more">Show more</button>`
  );
};

export default class ShomMoreButton extends AbstractComponent {
  getTemplate() {
    return createShomMoreButton();
  }
}
