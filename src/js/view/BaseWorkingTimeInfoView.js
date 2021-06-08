import View from '../core/View';

const tag = '[BaseWoringTimeInfoView]';

const BaseWorkingTimeInfoView = class extends View {
  constructor() {
    super();

    this.clickable = true;
  }

  /* 인터페이스 */
  setup = element => {
    this.init(element);

    this._weekdayInput = element.querySelector(`[data-input="weekday"]`);
    this._weekendInput = element.querySelector(`[data-input="weekend"]`);
    this._holidayInput = element.querySelector(`[data-input="holiday"]`);
    this._noticeInput = element.querySelector(`[data-textarea="notice"]`);

    this._updateBtn = element.querySelector('[data-update-btn]');

    this._bindEvents();

    return this;
  };

  initItems = infoObj => {
    for (const [day, info] of Object.entries(infoObj)) {
      const { id, time, comment } = info;
      if (day === '평일') {
        this._weekdayInput.value = time;
        this._noticeInput.value = comment;
      }
      if (day === '주말') {
        this._weekendInput.value = time;
      }
      if (day === '공휴일') {
        this._holidayInput.value = time;
      }
    }
  };

  /* 메서드 */
  _bindEvents = () => {
    this._weekdayInput.addEventListener('input', event => {
      if (event.target.value.length > 20) {
        event.target.value = event.target.value.substr(0, 20);
      }
      this.trigger('@changeWeekdayTime', { view: this, value: event.target.value });
    });
    this._weekendInput.addEventListener('input', event => {
      if (event.target.value.length > 20) {
        event.target.value = event.target.value.substr(0, 20);
      }
      this.trigger('@changeWeekendTime', { view: this, value: event.target.value });
    });
    this._holidayInput.addEventListener('input', event => {
      if (event.target.value.length > 20) {
        event.target.value = event.target.value.substr(0, 20);
      }
      this.trigger('@changeHolidayTime', { view: this, value: event.target.value });
    });
    this._noticeInput.addEventListener('input', event => {
      if (event.target.value.length > 200) {
        event.target.value = event.target.value.substr(0, 200);
      }
      this.trigger('@changeNoticeTime', { view: this, value: event.target.value });
    });

    this._updateBtn.addEventListener('click', () => {
      if (!this.clickable) return;
      if (this._weekdayInput.value.trim().length === 0) return this._weekdayInput.focus();
      if (this._weekendInput.value.trim().length === 0) return this._weekdayInput.focus();
      if (this._holidayInput.value.trim().length === 0) return this._weekdayInput.focus();

      this.trigger('@updateWorkingTimeInfo', { view: this });
    });
  };
};

export default BaseWorkingTimeInfoView;
