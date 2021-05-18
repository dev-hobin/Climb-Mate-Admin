import View from '../core/View';
import { BASE_CENTER_INFO_TYPE } from '../model/BaseCenterInfoModel';

const tag = '[BaseCenterInfoView]';

const BaseCenterInfoView = class extends View {
  constructor() {
    super();
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

    console.log(tag, 'setup()');
    return this;
  };

  initItems = infoObj => {
    console.log(tag, 'initial 정보대로 기본 정보 설정');

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
    this._extraAddressInput.addEventListener('input', () => {
      const value = this._extraAddressInput.value;
      this.trigger('@chageExtraAddress', { value });
    });
    Array.from(this._callNumberInputs).forEach((input, index) => {
      // index -> 0: 첫 번째 칸, 1: 두 번째 칸, 2: 세 번째 칸
      input.addEventListener('input', event => {
        if (event.target.value.length > 4) return (event.target.value = event.target.value.substring(0, 4));
        event.target.value = event.target.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');
        this.trigger('@changeCallNum', {
          number: event.target.value,
          index,
        });
      });
    });
    Array.from(this._phoneCallNumberInputs).forEach((input, index) => {
      // index -> 0: 첫 번째 칸, 1: 두 번째 칸, 2: 세 번째 칸
      input.addEventListener('input', event => {
        if (event.target.value.length > 4) return (event.target.value = event.target.value.substring(0, 4));
        event.target.value = event.target.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');
        this.trigger('@changePhoneCallNum', {
          number: event.target.value,
          index,
        });
      });
    });
    this._introduceTextarea.addEventListener('input', event => {
      this.trigger('@changeIntroduce', { value: event.target.value });
    });
    this._updateBtn.addEventListener('click', () => this.trigger('@updateCenterInfo'));
    console.log(tag, '트리거 이벤트 등록 완료');
  };
};

export default BaseCenterInfoView;
