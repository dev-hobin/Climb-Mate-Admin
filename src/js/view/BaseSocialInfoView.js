import View from '../core/View';

import { BASE_SOCIAL_INFO_TYPE } from '../model/BaseSocialInfoModel';

const tag = '[BaseSocialInfoView]';

const BaseSocialInfoView = class extends View {
  constructor() {
    super();

    this.clickable = true;
  }

  /* 인터페이스 */
  setup = element => {
    this.init(element);

    this._items = Array.from(element.querySelectorAll('[data-social-item]'));
    this._checkboxes = Array.from(element.querySelectorAll('[data-checkbox]'));
    this._urlInputs = Array.from(element.querySelectorAll('[data-url-input]'));

    this._updateBtn = element.querySelector('[data-update-btn]');

    this._bindEvents();

    return this;
  };

  initItems = (checkInfoObj, urlInfoObj) => {
    this._items.forEach(item => {
      const itemType = item.dataset.socialItem;
      const checkbox = item.querySelector('[data-checkbox]');
      const urlInput = item.querySelector('[data-url-input]');

      checkbox.checked = checkInfoObj[itemType];
      urlInput.value = urlInfoObj[itemType];
    });
  };

  /* 메서드 */
  _bindEvents = () => {
    this._checkboxes.forEach(checkbox => {
      checkbox.addEventListener('change', event => {
        const socialType = event.target.closest('[data-social-item]').dataset.socialItem;
        if (this._getCheckedCount() > 2) {
          event.target.checked = false;
          this.trigger('@checkSocial', { view: this, socialType, overCount: true });
        } else {
          this.trigger('@checkSocial', { view: this, socialType, overCount: false });
        }
      });
    });

    this._urlInputs.forEach(input => {
      input.addEventListener('input', event => {
        const socialType = event.target.closest('[data-social-item]').dataset.socialItem;
        this.trigger('@changeSocialUrl', { view: this, socialType, url: event.target.value });
      });
    });

    this._updateBtn.addEventListener('click', () => {
      if (!this.clickable) return;
      this.trigger('@updateSocialInfo', { view: this });
    });
  };

  _getCheckedCount = () => {
    let count = 0;
    for (const checkbox of this._checkboxes) {
      if (checkbox.checked) count++;
    }
    return count;
  };
};

export default BaseSocialInfoView;
