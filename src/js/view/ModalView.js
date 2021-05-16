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
  showAlertModal = (alertMessage = '', eventInfo = {}) => {
    const modal = document.createElement('div');
    modal.setAttribute('class', 'modal');
    modal.setAttribute('data-modal', '');
    modal.innerHTML = this._getAlertContentsHtml(alertMessage);

    const cancelBtn = modal.querySelector(`[data-type="cancel"]`);
    const confirm = modal.querySelector(`[data-type="confirm"]`);

    const { type, index } = eventInfo;
    switch (type) {
      case 'banner':
        confirm.addEventListener('click', () => this.trigger('@deleteItem', { type: 'banner', index }));
        break;
      case 'bordering':
        confirm.addEventListener('click', () => this.trigger('@deleteItem', { type: 'bordering', index }));
        break;
      case 'endurance':
        confirm.addEventListener('click', () => this.trigger('@deleteItem', { type: 'endurance', index }));
        break;
      default:
        throw `${tag} showAlertModal() 이벤트 등록 실패`;
    }
    cancelBtn.addEventListener('click', () => this.removeModal());

    this._element.append(modal);
  };
  removeModal = () => {
    this._element.querySelector('[data-modal]').remove();
  };

  /* 메서드 */
  _getLoaingContentsHtml = loadingMessage => {
    return `<div class="modal__contents" data-type="loading">
            <div class="loading-spinner modal__loading-spinner">
                <div class="loading-spinner__item"></div>
                <div class="loading-spinner__item"></div>
            </div>
            <p class="modal__loading-message">${loadingMessage}</p>
          </div>`;
  };
  _getAlertContentsHtml = alertMessage => {
    return `<div class="modal__contents" data-type="alert">
            <i class="fas fa-exclamation-triangle modal__alert-icon"></i>
            <p class="modal__alert-message">${alertMessage}</p>
            <div class="flex-center-container modal__alert-btn-container">
              <button class="cancel-btn" data-type="cancel">취소</button>
              <button class="confirm-btn" data-type="confirm">확인</button>
            </div>
          </div>`;
  };
};

export default ModalView;
