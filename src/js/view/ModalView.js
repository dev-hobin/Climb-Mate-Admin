import View from '../core/View';

import { SINGLE_IMAGE_UPLOADER_TYPE } from '../model/SingleImageUploadModel';

const tag = '[ModalView]';

const ModalView = class extends View {
  constructor() {
    super();

    this.clickable = true;
  }

  /* 인터페이스 */

  setup = element => {
    this.init(element);
    return this;
  };

  showLoadingModal = (loadingMessage = '') => {
    const modal = document.createElement('div');
    modal.setAttribute('class', 'modal');
    modal.setAttribute('data-modal', '');
    modal.innerHTML = this._getLoaingContentsHtml(loadingMessage);

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

    switch (true) {
      case eventName === 'image-uploader__delete-image':
        this._addImageUploaderDeleteImageEvent(confirm, eventInfo);
        break;

      case eventName === 'single-image-uploader__delete-image':
        this._addSingleImageUploaderDeleteImageEvent(confirm, eventInfo);
        break;

      case eventName === 'extra-price-info__delete-item':
        this._addExtraPriceInfoDeleteItemEvent(confirm, eventInfo);
        break;

      case eventName === 'level-info__delete-item':
        this._addLevelInfoDeleteItemEvent(confirm, eventInfo);
        break;

      case eventName === 'sidebar__logout':
        this._addLogoutEvent(confirm);
        break;

      default:
        throw `${tag} 올바른 이벤트 정보가 아닙니다 :${eventName}`;
    }

    cancelBtn.addEventListener('click', () => this.removeModal());

    this._element.append(modal);
  };
  removeModal = () => this._element.querySelector('[data-modal]').remove();

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
          if (!this.clickable) return;

          this.trigger('@deleteItem', { type, index });
          this.removeModal();
          this.clickable = true;
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
        confirm.addEventListener('click', () => {
          if (!this.clickable) return;

          this.trigger('@confirmPriceImageDelete', { type });
          this.removeModal();
          this.clickable = true;
        });
        break;
      case SINGLE_IMAGE_UPLOADER_TYPE.LEVEL:
        confirm.addEventListener('click', () => {
          if (!this.clickable) return;

          this.trigger('@confirmLevelImageDelete', { type });
          this.removeModal();
          this.clickable = true;
        });
        break;
      default:
        throw `${tag} showAlertModal() 이벤트 등록 실패`;
    }
  };
  // 추가 상품 정보에서 아이템 삭제하는 이벤트
  _addExtraPriceInfoDeleteItemEvent = (confirm, { goodsName }) => {
    confirm.addEventListener('click', () => {
      if (!this.clickable) return;

      this.trigger('@confirmExtraPriceItemDelete', { goodsName });
      this.removeModal();
      this.clickable = true;
    });
  };
  // 난이도 정보에서 아이템 삭제하는 이벤트
  _addLevelInfoDeleteItemEvent = (confirm, { type, color, levelName }) => {
    confirm.addEventListener('click', () => {
      if (!this.clickable) return;

      this.trigger('@confirmLevelInfoItemDelete', { type, color, levelName });
      this.removeModal();

      this.clickable = true;
    });
  };
  // 로그아웃 이벤트
  _addLogoutEvent = confirm => {
    confirm.addEventListener('click', () => {
      if (!this.clickable) return;

      this.trigger('@logout');
      this.removeModal();

      this.clickable = true;
    });
  };
};

export default ModalView;
