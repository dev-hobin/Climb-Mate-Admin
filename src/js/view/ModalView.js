import View from '../core/View';

const tag = '[ModalView]';

const ModalView = class extends View {
  constructor() {
    super();
  }

  /* 인터페이스 */

  setup = element => {
    this.init(element);
    console.log(`${tag} setup()`);
    return this;
  };

  showLoadingModal = (loaingMessage = '') => {
    const modal = document.createElement('div');
    modal.setAttribute('class', 'modal');
    modal.setAttribute('data-modal', '');
    modal.innerHTML = this._getLoaingContentsHtml(loaingMessage);

    this._element.append(modal);
  };
  removeModal = () => {
    this._element.querySelector('[data-modal]').remove();
  };

  /* 메서드 */
  _getLoaingContentsHtml = loaingMessage => {
    return `<div class="modal__contents" data-type="loading">
            <div class="loading-spinner modal__loading-spinner">
                <div class="loading-spinner__item"></div>
                <div class="loading-spinner__item"></div>
            </div>
            <p class="modal__loading-message">${loaingMessage}</p>
          </div>`;
  };
};

export default ModalView;
