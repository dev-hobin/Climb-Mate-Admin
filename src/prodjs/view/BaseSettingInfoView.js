import View from '../core/View';

import flatpickr from 'flatpickr';
import { Korean } from 'flatpickr/dist/l10n/ko';

import { BASE_SETTING_INFO_TYPE } from '../model/BaseSettingInfoModel';
const tag = '[CenterInfoView]';

const BaseSettingInfoView = class extends View {
  constructor() {
    super();

    this.clickable = true;
  }

  /* 인터페이스 */
  setup = element => {
    this.init(element);

    this._borderingRatioInput = element.querySelector(`input[data-type="bordering"]`);
    this._enduranceRatioInput = element.querySelector(`input[data-type="endurance"]`);
    this._settingRatioInput = element.querySelector(`input[data-setting-ratio-description]`);

    this._settingCycleInput = element.querySelector(`input[data-setting-cycle]`);

    this._nextSettingDateInput = element.querySelector(`input[data-next-setting-date]`);
    flatpickr(`input[data-next-setting-date]`, {
      locale: Korean,
    });
    this._recentSettingDateInput = element.querySelector(`input[data-recent-setting-date]`);
    flatpickr(`input[data-recent-setting-date]`, {
      locale: Korean,
    });

    this._updateBtn = element.querySelector('[data-update-btn]');

    this._bindEvents();
    return this;
  };

  initItems = infoObj => {
    this._borderingRatioInput.value = infoObj[BASE_SETTING_INFO_TYPE.SETTING_RATIO][0];
    this._enduranceRatioInput.value = infoObj[BASE_SETTING_INFO_TYPE.SETTING_RATIO][1];
    this._settingRatioInput.value = infoObj[BASE_SETTING_INFO_TYPE.SETTING_RATIO_DESCRIPTION];

    this._settingCycleInput.value = infoObj[BASE_SETTING_INFO_TYPE.SETTING_CYCLE];
    this._nextSettingDateInput.value = infoObj[BASE_SETTING_INFO_TYPE.NEXT_SETTING_DATE];
    this._recentSettingDateInput.value = infoObj[BASE_SETTING_INFO_TYPE.RECENT_SETTING_DATE];
  };

  /* 메서드 */
  _bindEvents = () => {
    this._borderingRatioInput.addEventListener('input', event => {
      event.target.value = event.target.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');

      if (Number(event.target.value) > 10) event.target.value = event.target.value.substring(0, 1);
      const thisRatio = event.target.value ? Number(event.target.value) : 0;
      const anotherRatio = 10 - thisRatio;

      event.target.value = thisRatio;
      this._enduranceRatioInput.value = anotherRatio;

      this.trigger('@changeSettingRatio', { view: this, bordering: thisRatio, endurance: anotherRatio });
    });
    this._enduranceRatioInput.addEventListener('input', event => {
      event.target.value = event.target.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');

      if (Number(event.target.value) > 10) event.target.value = event.target.value.substring(0, 1);
      const thisRatio = event.target.value ? Number(event.target.value) : 0;
      const anotherRatio = 10 - thisRatio;

      event.target.value = thisRatio;
      this._borderingRatioInput.value = anotherRatio;

      this.trigger('@changeSettingRatio', { view: this, bordering: anotherRatio, endurance: thisRatio });
    });
    this._settingRatioInput.addEventListener('input', event => {
      if (event.target.value.length > 200) {
        event.target.value = event.target.value.substr(0, 200);
      }
      this.trigger('@changeSettingRatioDescription', { view: this, value: event.target.value });
    });

    this._settingCycleInput.addEventListener('input', event => {
      if (event.target.value.length > 200) {
        event.target.value = event.target.value.substr(0, 200);
      }
      this.trigger('@changeSettingCycle', { view: this, value: event.target.value });
    });
    this._nextSettingDateInput.addEventListener('input', event => {
      this.trigger('@chageNextSettingDate', { view: this, value: event.target.value });
    });
    this._recentSettingDateInput.addEventListener('input', event => {
      this.trigger('@chageRecentSettingDate', { view: this, value: event.target.value });
    });

    this._updateBtn.addEventListener('click', () => {
      if (!this.clickable) return;
      if (this._settingRatioInput.value.trim().length === 0) return this._settingRatioInput.focus();
      if (this._settingCycleInput.value.trim().length === 0) return this._settingCycleInput.focus();
      if (this._recentSettingDateInput.value.trim().length === 0) return this._recentSettingDateInput.focus();
      this.trigger('@updateSettingInfo', { view: this });
    });
  };
};

export default BaseSettingInfoView;
