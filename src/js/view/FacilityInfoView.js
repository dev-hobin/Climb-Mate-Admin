import View from '../core/View';

const tag = '[FacilityInfoView]';

const FACILITY_TYPE = {
  SHOWER_ROOM: 'shower-room',
  FITTING_ROOM: 'fitting-room',
  WASHROOM: 'washroom',
  RESTROOM: 'restroom',
  LOCKER: 'locker',
  TOWEL: 'towel',
  LEAD_WALL: 'lead-wall',
};

const dummyCheckInfo = {
  [FACILITY_TYPE.SHOWER_ROOM]: true,
  [FACILITY_TYPE.FITTING_ROOM]: false,
  [FACILITY_TYPE.WASHROOM]: false,
  [FACILITY_TYPE.RESTROOM]: true,
  [FACILITY_TYPE.LOCKER]: false,
  [FACILITY_TYPE.TOWEL]: true,
  [FACILITY_TYPE.LEAD_WALL]: false,
};

const FacilityInfoView = class extends View {
  constructor() {
    super();
  }

  /* 인터페이스 */
  setup = element => {
    this.init(element);

    this._itemList = element.querySelector('[data-list]');
    this._items = element.querySelectorAll('[data-item]');

    this._bindEvents();

    console.log(tag, 'setup()');
    return this;
  };

  initItems = (itemInfoObj = dummyCheckInfo) => {
    console.log(tag, 'initial, current 체크 정보 저장');
    this._initialFacilityCheckInfo = itemInfoObj;
    this._currentFacilityCheckInfo = itemInfoObj;

    console.log(tag, 'initial 정보대로 체크박스 체크');
    this._items.forEach(item => {
      const facilityType = item.dataset.item;
      const checkbox = item.querySelector('[type=checkbox]');
      checkbox.checked = this._initialFacilityCheckInfo[facilityType];
    });
  };

  /* 메서드 */
  _bindEvents = () => {
    this._itemList.addEventListener('click', event => {
      if (event.target.type !== 'checkbox') return;
      const checkbox = event.target;
      const facilityType = event.target.closest('[data-item]').dataset.item;
      this._currentFacilityCheckInfo[facilityType] = checkbox.checked;
      console.log(tag, 'current 시설 체크 정보 수정', this._currentFacilityCheckInfo);
    });
  };
};

export default FacilityInfoView;
