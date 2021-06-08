import View from '../core/View';
import { BASE_CENTER_INFO_TYPE } from '../model/BaseCenterInfoModel';

const tag = '[BaseCenterInfoView]';

const BaseCenterInfoView = class extends View {
  constructor() {
    super();

    this.clickable = true;
  }

  /* 인터페이스 */
  setup = element => {
    this.init(element);

    this._name = element.querySelector('[data-center-name]');
    this._address = element.querySelector('[data-center-address]');
    this._extraAddressInput = element.querySelector('[data-extra-address-input]');

    this._callNumberInputs = element.querySelectorAll('[data-call-number]');
    this._phoneCallNumberInputs = element.querySelectorAll('[data-phone-call-number]');

    this._introduceTextarea = element.querySelector('[data-center-introduce]');

    this._updateBtn = element.querySelector('[data-update-btn]');

    this._bindEvents();

    return this;
  };

  initItems = infoObj => {
    this._name.textContent = infoObj[BASE_CENTER_INFO_TYPE.CENTER_NAME];
    this._address.textContent = infoObj[BASE_CENTER_INFO_TYPE.CENTER_ADDRESS];
    this._extraAddressInput.value = infoObj[BASE_CENTER_INFO_TYPE.EXTRA_CENTER_ADDRESS];

    Array.from(this._callNumberInputs).forEach((input, index) => {
      input.value = infoObj[BASE_CENTER_INFO_TYPE.CALL_NUMBER][index];
    });
    Array.from(this._phoneCallNumberInputs).forEach((input, index) => {
      input.value = infoObj[BASE_CENTER_INFO_TYPE.PHONE_CALL_NUMBER][index];
    });

    this._introduceTextarea.value = infoObj[BASE_CENTER_INFO_TYPE.CENTER_INTRODUCE];
  };

  /* 메서드 */
  _bindEvents = () => {
    this._extraAddressInput.addEventListener('input', event => {
      if (event.target.value.length > 40) {
        event.target.value = event.target.value.substr(0, 40);
      }

      const value = event.target.value;
      this.trigger('@chageExtraAddress', { view: this, value });
    });
    Array.from(this._callNumberInputs).forEach((input, index) => {
      // index -> 0: 첫 번째 칸, 1: 두 번째 칸, 2: 세 번째 칸
      input.addEventListener('input', event => {
        event.target.value = event.target.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');
        if (event.target.value.length > 4) return (event.target.value = event.target.value.substring(0, 4));
        this.trigger('@changeCallNum', {
          view: this,
          number: event.target.value,
          index,
        });
      });
    });
    Array.from(this._phoneCallNumberInputs).forEach((input, index) => {
      // index -> 0: 첫 번째 칸, 1: 두 번째 칸, 2: 세 번째 칸
      input.addEventListener('input', event => {
        event.target.value = event.target.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');
        if (event.target.value.length > 4) return (event.target.value = event.target.value.substring(0, 4));
        this.trigger('@changePhoneCallNum', {
          view: this,
          number: event.target.value,
          index,
        });
      });
    });
    this._introduceTextarea.addEventListener('input', event => {
      if (event.target.value.length > 1500) {
        event.target.value = event.target.value.substr(0, 1500);
      }
      this.trigger('@changeIntroduce', { view: this, value: event.target.value });
    });
    this._updateBtn.addEventListener('click', () => {
      if (!this.clickable) return;

      const emptyCallNumInput = Array.from(this._callNumberInputs) //
        .find(input => input.value.trim().length === 0);
      if (emptyCallNumInput) return emptyCallNumInput.focus();

      const emptyPhoneCallNumInput = Array.from(this._phoneCallNumberInputs) //
        .find(input => input.value.trim().length === 0);

      if (emptyPhoneCallNumInput) return emptyCallNumInput.focus();

      this.trigger('@updateCenterInfo', { view: this });
    });
  };
};

export default BaseCenterInfoView;
