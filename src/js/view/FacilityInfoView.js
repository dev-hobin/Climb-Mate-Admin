import View from '../core/View';
import { FACILITY_TYPE, FACILITY_EXTRA_INFO } from '../model/FacilityInfoModel';

const tag = '[FacilityInfoView]';

const FacilityInfoView = class extends View {
  constructor() {
    super();

    this.clickable = true;
  }

  /* 인터페이스 */
  setup = element => {
    this.init(element);

    this._itemList = element.querySelector('[data-list]');
    this._items = element.querySelectorAll('[data-item]');

    this._parkignLotTextContainer = element.querySelector('[data-parking-lot-description-container]');
    this._parkignLotTextArea = element.querySelector('[data-parking-lot-description-textarea]');

    this._updateBtn = element.querySelector('[data-update-btn]');

    this._bindEvents();

    return this;
  };

  initItems = (itemInfoObj, extraInfoObj) => {
    // 주차장 추가 설명 텍스트 설정
    this._parkignLotTextArea.value = extraInfoObj[FACILITY_EXTRA_INFO.PARKING_LOT];

    this._items.forEach(item => {
      const facilityType = item.dataset.item;
      const checkbox = item.querySelector('[type=checkbox]');
      checkbox.checked = itemInfoObj[facilityType];
      if (facilityType === FACILITY_TYPE.PARKING_LOT && checkbox.checked)
        this._parkignLotTextContainer.classList.add('show');
    });
  };

  /* 메서드 */
  _bindEvents = () => {
    this._itemList.addEventListener('click', event => {
      if (!this.clickable) return;
      if (event.target.type !== 'checkbox') return;
      const checkbox = event.target;
      const facilityType = event.target.closest('[data-item]').dataset.item;
      this.trigger('@checkFacility', { view: this, facilityType, checked: checkbox.checked });
      // 주차장 체크 해제했을 경우 텍스트 박스 안보이게
      if (facilityType === FACILITY_TYPE.PARKING_LOT) {
        if (checkbox.checked) this._parkignLotTextContainer.classList.add('show');
        else this._parkignLotTextContainer.classList.remove('show');
      }
    });

    this._parkignLotTextArea.addEventListener('keyup', event => {
      if (event.target.value.length > 200) {
        event.target.value = event.target.value.substr(0, 200);
      }
      const textValue = event.target.value;
      this.trigger('@editExtraInfo', { view: this, extra: FACILITY_EXTRA_INFO.PARKING_LOT, info: textValue });
    });

    this._updateBtn.addEventListener('click', () => {
      if (!this.clickable) return;
      this.trigger('@updateFacility', { view: this });
    });
  };
};

export default FacilityInfoView;
