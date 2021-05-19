import View from '../core/View';

import { SINGLE_IMAGE_UPLOADER_TYPE } from '../model/SingleImageUploadModel';

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

    const { eventName } = eventInfo;
    console.log(eventInfo);

    switch (true) {
      case eventName === 'image-uploader__delete-image':
        this._addImageUploaderDeleteImageEvent(confirm, eventInfo);
        break;

      case eventName === 'single-image-uploader__delete-image':
        this._addSingleImageUploaderDeleteImageEvent(confirm, eventInfo);
        break;

      default:
        throw `${tag} 올바른 이벤트 정보가 아닙니다 :${eventName}`;
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

  // 이벤트들

  // 멀티 이미지 업로더에서 이미지 삭제하는 이벤트
  _addImageUploaderDeleteImageEvent = (confirm, { type, index }) => {
    switch (type) {
      case 'banner':
      case 'bordering':
      case 'endurance':
        confirm.addEventListener('click', () => {
          this.trigger('@deleteItem', { type, index });
          this.removeModal();
        });
        break;
      default:
        throw `${tag} showAlertModal() 이벤트 등록 실패`;
    }
  };
  // 싱글 이미지 업로더에서 이미지 삭제하는 이벤트 (가격표, 난이도)
  _addSingleImageUploaderDeleteImageEvent = (confirm, { type }) => {
    switch (type) {
      case SINGLE_IMAGE_UPLOADER_TYPE.PRICE:
      case SINGLE_IMAGE_UPLOADER_TYPE.LEVEL:
        confirm.addEventListener('click', () => {
          this.trigger('@confirmPriceImageDelete', { type });
          this.removeModal();
        });
        break;
      default:
        throw `${tag} showAlertModal() 이벤트 등록 실패`;
    }
  };
};

export default ModalView;
