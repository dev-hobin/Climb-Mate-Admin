import View from '../core/View';

const tag = '[BaseWoringTimeInfoView]';

const BaseWorkingTimeInfoView = class extends View {
  constructor() {
    super();
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
      this.trigger('@changeWeekdayTime', { value: event.target.value });
    });
    this._weekendInput.addEventListener('input', event => {
      this.trigger('@changeWeekendTime', { value: event.target.value });
    });
    this._holidayInput.addEventListener('input', event => {
      this.trigger('@changeHolidayTime', { value: event.target.value });
    });
    this._noticeInput.addEventListener('input', event => {
      this.trigger('@changeNoticeTime', { value: event.target.value });
    });

    this._updateBtn.addEventListener('click', () => {
      this.trigger('@updateWorkingTimeInfo');
    });
  };
};

export default BaseWorkingTimeInfoView;
