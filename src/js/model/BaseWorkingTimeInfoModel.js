import Model from '../core/Model.js';

const tag = '[BaseWorkingTimeInfoModel]';

export const BASE_WORKING_TIME_INFO_TYPE = {
  WEEKDAY: 'WEEKDAY',
  WEEKEND: 'WEEKEND',
  HOLIDAY: 'HOLIDAY',
  NOTICE: 'NOTICE',
};

const dummyInfo = {
  [BASE_WORKING_TIME_INFO_TYPE.WEEKDAY]: '10:00 - 20:00',
  [BASE_WORKING_TIME_INFO_TYPE.WEEKEND]: '12:00 - 18:00',
  [BASE_WORKING_TIME_INFO_TYPE.HOLIDAY]: '12:00 - 18:00',
  [BASE_WORKING_TIME_INFO_TYPE.NOTICE]: '운영시간 추가 알림 알림 알림',
};

const BaseWorkingTimeInfoModel = class extends Model {
  constructor() {
    super();

    this._info = {
      initial: {},
      current: {},
    };
  }

  /* 인터페이스 */
  initInfo = async centerId => {
    this._info.initial = {
      ...dummyInfo,
    };
    this._info.current = {
      ...dummyInfo,
    };

    console.log(tag, '운영시간 정보 init 완료');
    return this._info.initial;
  };
  changeWeekdayTime = value => {
    this._info.current.WEEKDAY = value;
    console.log(tag, '평일 운영시간 변경', [this._info.current.WEEKDAY]);
  };
  changeWeekendTime = value => {
    this._info.current.WEEKEND = value;
    console.log(tag, '주말 운영시간 변경', [this._info.current.WEEKEND]);
  };
  changeHolidayTime = value => {
    this._info.current.HOLIDAY = value;
    console.log(tag, '공휴일 운영시간 변경', [this._info.current.HOLIDAY]);
  };
  changeNoticeTime = value => {
    this._info.current.NOTICE = value;
    console.log(tag, '운영시간 추가 알림 변경', [this._info.current.NOTICE]);
  };

  update = async () => {
    const isChanged = this._isInfoChanged();
    if (!isChanged)
      return {
        isSuccess: false,
        error: { sort: 'caution', title: '변경된 정보가 없습니다', description: '운영시간 정보를 변경해주세요' },
      };
    console.group(tag, '서버로 보낼 수 있는 정보');
    console.log('변경된 운영시간 정보', this._info.current);
    console.groupEnd();
    console.log(tag, '운영시간 정보 업데이트 중');
    await new Promise(resolve => setTimeout(resolve, 3000));
    console.log(tag, '업데이트된 운영시간 정보로 기존 정보 업데이트');
    this._info.initial = {
      ...this._info.current,
    };
    console.log(tag, '운영시간 정보 업데이트 완료 후 결과 반환');
    return {
      isSuccess: true,
      error: '',
    };
  };

  // 메소드
  _isInfoChanged = () => {
    const initial = this._info.initial;
    const current = this._info.current;

    for (const [key, value] of Object.entries(current)) {
      if (initial[key] !== value) return true;
    }
    return false;
  };
};

export default BaseWorkingTimeInfoModel;
