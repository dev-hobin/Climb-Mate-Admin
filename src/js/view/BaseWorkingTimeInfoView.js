import View from '../core/View';

import { BASE_WORKING_TIME_INFO_TYPE } from '../model/BaseWorkingTimeInfoModel';

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

    console.log(tag, 'setup()');
    return this;
  };

  initItems = infoObj => {
    this._weekdayInput.value = infoObj[BASE_WORKING_TIME_INFO_TYPE.WEEKDAY];
    this._weekendInput.value = infoObj[BASE_WORKING_TIME_INFO_TYPE.WEEKEND];
    this._holidayInput.value = infoObj[BASE_WORKING_TIME_INFO_TYPE.HOLIDAY];
    this._noticeInput.value = infoObj[BASE_WORKING_TIME_INFO_TYPE.NOTICE];

    console.log(tag, 'initial 정보대로 운영시간 정보 설정');
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
