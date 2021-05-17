import View from '../core/View';

const tag = '[FacilityInfoView]';

const FacilityInfoView = class extends View {
  constructor() {
    super();
  }

  /* 인터페이스 */
  setup = element => {
    this.init(element);

    this._itemList = element.querySelector('[data-list]');
    this._items = element.querySelectorAll('[data-item]');
    this._updateBtn = element.querySelector('[data-update-btn]');

    this._bindEvents();

    console.log(tag, 'setup()');
    return this;
  };

  initItems = itemInfoObj => {
    console.log(tag, 'initial 정보대로 체크박스 체크');
    this._items.forEach(item => {
      const facilityType = item.dataset.item;
      const checkbox = item.querySelector('[type=checkbox]');
      checkbox.checked = itemInfoObj[facilityType];
    });
  };

  /* 메서드 */
  _bindEvents = () => {
    this._itemList.addEventListener('click', event => {
      if (event.target.type !== 'checkbox') return;
      const checkbox = event.target;
      const facilityType = event.target.closest('[data-item]').dataset.item;
      this.trigger('@checkFacility', { facilityType, checked: checkbox.checked });
    });

    this._updateBtn.addEventListener('click', () => this.trigger('@updateFacility'));
  };
};

export default FacilityInfoView;
