import Model from '../core/Model.js';

const tag = '[BaseSettingInfoModel]';

export const BASE_SETTING_INFO_TYPE = {
  SETTING_RATIO: 'SETTING_RATIO',
  SETTING_CYCLE: 'SETTING_CYCLE',
  NEXT_SETTING_DATE: 'NEXT_SETTING_DATE',
  RECENT_SETTING_DATE: 'RECENT_SETTING_DATE',
};

const dummyInfo = {
  [BASE_SETTING_INFO_TYPE.SETTING_RATIO]: ['6', '4'],
  [BASE_SETTING_INFO_TYPE.SETTING_CYCLE]: '3주에 한번 볼더링 문제 변경',
  [BASE_SETTING_INFO_TYPE.NEXT_SETTING_DATE]: '2021-07-07',
  [BASE_SETTING_INFO_TYPE.RECENT_SETTING_DATE]: '2021-05-05',
};

const BaseSettingInfoModel = class extends Model {
  constructor() {
    super();

    this._info = {
      initial: {},
      current: {},
    };
  }

  /* 인터페이스 */
  initInfo = async accessToken => {
    console.log('세팅 정보 더미 데이터', dummyInfo);
    const reqData = {
      reqCode: 3001,
      reqBody: {
        accessKey: accessToken,
      },
    };
    const {
      resCode,
      resBody: {
        conceptBordering,
        conceptEndurance,
        detailNextUpdate,
        detailRecentUpdate,
        detailCenterSettingCycle,
        detailCenterSettingRatio,
      },
      resErr,
    } = await this.postRequest(this.HOST.TEST_SERVER, this.PATHS.MAIN, reqData);

    this._info.initial = {
      ...dummyInfo,
      [BASE_SETTING_INFO_TYPE.SETTING_RATIO]: [...dummyInfo[BASE_SETTING_INFO_TYPE.SETTING_RATIO]],
    };
    this._info.current = {
      ...dummyInfo,
      [BASE_SETTING_INFO_TYPE.SETTING_RATIO]: [...dummyInfo[BASE_SETTING_INFO_TYPE.SETTING_RATIO]],
    };

    return this._info.initial;
  };

  changeSettingRatio = (bordering, endurance) => {
    this._info.current.SETTING_RATIO[0] = String(bordering);
    this._info.current.SETTING_RATIO[1] = String(endurance);
    console.log(tag, '세팅 비율 변경', this._info.current.SETTING_RATIO);
  };
  changeSettingCycle = value => {
    this._info.current.SETTING_CYCLE = value;
    console.log(tag, '세팅 주기 변경', [this._info.current.SETTING_CYCLE]);
  };
  chageNextSettingDate = value => {
    this._info.current.NEXT_SETTING_DATE = value;
    console.log(tag, '다음 세팅 날짜 변경', [this._info.current.NEXT_SETTING_DATE]);
  };
  chageRecentSettingDate = value => {
    this._info.current.RECENT_SETTING_DATE = value;
    console.log(tag, '최근 세팅 날짜 변경', [this._info.current.RECENT_SETTING_DATE]);
  };

  update = async () => {
    const isChanged = this._isInfoChanged();
    if (!isChanged)
      return {
        isSuccess: false,
        error: { sort: 'caution', title: '변경된 정보가 없습니다', description: '세팅 정보를 변경해주세요' },
      };
    console.group(tag, '서버로 보낼 수 있는 정보');
    console.log('변경된 세팅 정보', this._info.current);
    console.groupEnd();
    console.log(tag, '세팅 정보 업데이트 중');
    await new Promise(resolve => setTimeout(resolve, 3000));
    console.log(tag, '업데이트된 세팅 정보로 기존 정보 업데이트');
    this._info.initial = {
      ...this._info.current,
    };
    console.log(tag, '세팅 정보 업데이트 완료 후 결과 반환');
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
      if (Array.isArray(value)) {
        for (const [i, v] of value.entries()) {
          if (initial[key][i] !== v) return true;
        }
      } else {
        if (initial[key] !== value) return true;
      }
    }
    return false;
  };
};

export default BaseSettingInfoModel;
