import Model from '../core/Model.js';

const tag = '[BaseWorkingTimeInfoModel]';

const BaseWorkingTimeInfoModel = class extends Model {
  constructor() {
    super();

    this._info = {
      initial: {},
      current: {},
    };
  }

  /* 인터페이스 */
  initInfo = async accessToken => {
    const reqData = {
      reqCode: 3002,
      reqBody: {
        accessKey: accessToken,
      },
    };
    const {
      resCode,
      resBody: workingTimeArray,
      resErr,
    } = await this.postRequest(this.HOST.SERVER, this.PATHS.MAIN, reqData);

    console.log('운영시간 정보', workingTimeArray);

    if (resCode == this.RES_CODE.FAIL)
      return {
        isSuccess: false,
        error: {
          sort: 'error',
          title: '서버 오류',
          description: '운영시간 정보를 가져오는데 실패했습니다',
        },
        data: {},
      };

    this._info.initial = this._makeInfo(workingTimeArray);
    this._info.current = this._makeInfo(workingTimeArray);
    console.log(this._info.current);
    return {
      isSuccess: true,
      error: {},
      data: {
        workingTimeInfo: this._info.initial,
      },
    };
  };
  changeWeekdayTime = value => {
    for (const day of Object.keys(this._info.current)) {
      if (day !== '평일') continue;
      return (this._info.current[day]['time'] = value);
    }
  };
  changeWeekendTime = value => {
    for (const [day] of Object.keys(this._info.current)) {
      if (day !== '주말') continue;
      return (this._info.current[day]['time'] = value);
    }
  };
  changeHolidayTime = value => {
    for (const day of Object.keys(this._info.current)) {
      if (day !== '공휴일') continue;
      return (this._info.current[day]['time'] = value);
    }
  };
  changeNoticeTime = value => {
    for (const day of Object.keys(this._info.current)) {
      this._info.current[day]['comment'] = value;
    }
  };

  update = async (accessToken, centerId) => {
    const isChanged = this._isInfoChanged();
    if (!isChanged)
      return {
        isSuccess: false,
        error: { sort: 'caution', title: '변경된 정보가 없습니다', description: '운영시간 정보를 변경해주세요' },
      };
    console.group(tag, '서버로 보낼 수 있는 정보');
    console.log('변경된 운영시간 정보', this._info.current);
    console.groupEnd();
    console.log(tag, '운영시간 정보 업데이트 중...');

    const reqData = {
      reqCode: 1002,
      reqBody: {
        accessKey: accessToken,
        id: centerId,
        scheduleWeekday: this._info.current['평일']['time'],
        scheduleWeekend: this._info.current['주말']['time'],
        scheduleHoliday: this._info.current['공휴일']['time'],
        detailScheduleComment: this._info.current['평일']['comment'],
      },
    };
    console.log('보낸 데이터', reqData);
    const { resCode, resBody, resErr } = await this.postRequest(this.HOST.SERVER, this.PATHS.MAIN, reqData);
    console.log('결과', { resCode, resBody, resErr });
    if (resCode == this.RES_CODE.FAIL) {
      return {
        isSuccess: false,
        error: {
          sort: 'error',
          title: '서버 오류',
          description: '운영시간 정보를 수정하는데 실패했습니다',
        },
        data: {},
      };
    } else {
      this._info.initial = {
        평일: { ...this._info.current['평일'] },
        주말: { ...this._info.current['주말'] },
        공휴일: { ...this._info.current['공휴일'] },
      };
      return {
        isSuccess: true,
        error: {},
        data: {},
      };
    }
  };

  // 메소드
  _makeInfo = infoArray => {
    const workingTimeInfo = {};
    infoArray.forEach(info => {
      const { id, scheduleDay, scheduleTime, detailScheduleComment } = info;
      workingTimeInfo[scheduleDay] = {
        id,
        time: scheduleTime,
        comment: detailScheduleComment,
      };
    });
    return workingTimeInfo;
  };

  _isInfoChanged = () => {
    const initial = this._info.initial;
    const current = this._info.current;

    for (const [day, info] of Object.entries(current)) {
      const { time, comment } = info;
      console.log(day);
      console.log(info);
      console.log(initial[day]);
      if (initial[day]['time'] !== time) return true;
      if (initial[day]['comment'] !== comment) return true;
    }
    return false;
  };
};

export default BaseWorkingTimeInfoModel;
