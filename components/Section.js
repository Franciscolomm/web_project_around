export default class Section {
  constructor({ item, renderer }, containerSelector) {
    this._renderedItems = item;
    this._renderer = renderer;
    this._container = document.querySelector(containerSelector);
  }
  renderer() {
    this._renderedItems.forEach((item) => {
      this._renderer(item);
    });
  }
  addItem(elment) {
    this._container.prepend(elment);
  }
}
