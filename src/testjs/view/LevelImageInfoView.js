import View from '../core/View';
import { SINGLE_IMAGE_UPLOADER_TYPE } from '../model/SingleImageUploadModel';

const tag = '[LevelImageInfoView]';

const emptyImageUrl = '/testWeb/admin/assets/images/empty-picture.png';
const LevelImageInfoView = class extends View {
  constructor() {
    super();

    this.clickable = true;

    this._template = new Template();
  }

  /* 인터페이스 */
  setup = element => {
    this.init(element);

    this._imageInput = element.querySelector('[data-level-image-input]');
    this._image = element.querySelector('[data-level-image]');

    this._btnContainer = element.querySelector('[data-btn-container]');

    this._bindEvents();

    return this;
  };

  setImage = url => {
    if (!url) return this.setEmptyImage();
    this._image.setAttribute('src', url);
    this._btnContainer.innerHTML = this._template.getDeleteBtn();
  };
  setTempImage = file => {
    const tempImageUrl = URL.createObjectURL(file);
    this._image.setAttribute('src', tempImageUrl);
    this._image.onload = () => URL.revokeObjectURL(tempImageUrl);
    this._btnContainer.innerHTML = this._template.getSelectBtns();
  };
  setInitialImage = url => {
    if (!url) return this.setEmptyImage();
    this._image.setAttribute('src', url);
    this._btnContainer.innerHTML = this._template.getDeleteBtn();
  };
  setEmptyImage = () => {
    this._image.setAttribute('src', emptyImageUrl);
    this._btnContainer.innerHTML = '';
  };

  /* 메소드 */
  _bindEvents = () => {
    // 이미지 인풋 이벤트 달기
    this._imageInput.addEventListener('change', event => {
      if (event.target.files.length === 0) return;
      const fileList = [...event.target.files];
      this.trigger('@changeImage', { view: this, type: SINGLE_IMAGE_UPLOADER_TYPE.LEVEL, fileList });
    });

    this._btnContainer.addEventListener('click', event => {
      if (!this.clickable) return;

      const btnType = event.target.dataset.btn;
      if (!btnType) return;
      switch (true) {
        case btnType === 'confirm':
          this.trigger('@confirmImage', { view: this, type: SINGLE_IMAGE_UPLOADER_TYPE.LEVEL });
          break;
        case btnType === 'cancel':
          this.trigger('@cancelImage', { view: this, type: SINGLE_IMAGE_UPLOADER_TYPE.LEVEL });
          break;
        case btnType === 'delete':
          this.trigger('@showAlert', {
            view: this,
            description: '정말로 삭제하시겠습니까?',
            eventInfo: {
              eventName: 'single-image-uploader__delete-image',
              type: SINGLE_IMAGE_UPLOADER_TYPE.LEVEL,
            },
          });
          break;
        default:
          throw `${tag} 올바른 버튼 타입이 아닙니다`;
      }
    });
  };
};

class Template {
  getSelectBtns = () => {
    return `
        <button class="single-image-uploader__btn" data-btn="confirm">확인</button>
        <button class="single-image-uploader__btn" data-btn="cancel">취소</button>
    `;
  };

  getDeleteBtn = () => {
    return `<button class="single-image-uploader__btn" data-btn="delete">삭제</button>`;
  };
}

export default LevelImageInfoView;
