import AbstractComponent from "./abstract-component.js";

const createFooterStatiscticTemplate = (count) => {
  return (
    `<section class="footer__statistics">
    <p>${count} movies inside</p>
  </section>`
  );
};


export default class FooterStatistic extends AbstractComponent {
  constructor(count) {
    super();
    this._count = count;
  }

  getTemplate() {
    return createFooterStatiscticTemplate(this._count);
  }
}
