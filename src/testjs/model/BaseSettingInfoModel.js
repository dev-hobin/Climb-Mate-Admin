import Model from '../core/Model.js';

const tag = '[BaseSettingInfoModel]';

export const BASE_SETTING_INFO_TYPE = {
  SETTING_RATIO: 'SETTING_RATIO',
  SETTING_CYCLE: 'SETTING_CYCLE',
  NEXT_SETTING_DATE: 'NEXT_SETTING_DATE',
  RECENT_SETTING_DATE: 'RECENT_SETTING_DATE',
  SETTING_RATIO_DESCRIPTION: 'SETTING_RATIO_DESCRIPTION',
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
    } = await this.postRequest(this.HOST.SERVER, this.PATHS.MAIN, reqData);

    if (resCode == this.RES_CODE.FAIL)
      return {
        isSuccess: false,
        error: {
          sort: 'error',
          title: '서버 오류',
          description: '세팅 정보를 가져오는데 실패했습니다',
        },
        data: {},
      };

    this._info.initial = {
      [BASE_SETTING_INFO_TYPE.SETTING_RATIO]: [conceptBordering, conceptEndurance],
      [BASE_SETTING_INFO_TYPE.SETTING_CYCLE]: detailCenterSettingCycle,
      [BASE_SETTING_INFO_TYPE.NEXT_SETTING_DATE]: detailNextUpdate,
      [BASE_SETTING_INFO_TYPE.RECENT_SETTING_DATE]: detailRecentUpdate,
      [BASE_SETTING_INFO_TYPE.SETTING_RATIO_DESCRIPTION]: detailCenterSettingRatio,
    };
    this._info.current = {
      [BASE_SETTING_INFO_TYPE.SETTING_RATIO]: [conceptBordering, conceptEndurance],
      [BASE_SETTING_INFO_TYPE.SETTING_CYCLE]: detailCenterSettingCycle,
      [BASE_SETTING_INFO_TYPE.NEXT_SETTING_DATE]: detailNextUpdate,
      [BASE_SETTING_INFO_TYPE.RECENT_SETTING_DATE]: detailRecentUpdate,
      [BASE_SETTING_INFO_TYPE.SETTING_RATIO_DESCRIPTION]: detailCenterSettingRatio,
    };

    return {
      isSuccess: true,
      error: {},
      data: {
        settingInfo: this._info.initial,
      },
    };
  };

  changeSettingRatio = (bordering, endurance) => {
    this._info.current.SETTING_RATIO[0] = String(bordering);
    this._info.current.SETTING_RATIO[1] = String(endurance);
    console.log(tag, '세팅 비율 변경', this._info.current.SETTING_RATIO);
  };
  changeSettingRatioDescription = value => {
    this._info.current.SETTING_RATIO_DESCRIPTION = value;
    console.log(tag, '세팅 비율 설명 변경', [this._info.current.SETTING_RATIO_DESCRIPTION]);
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

  update = async (accessToken, centerId) => {
    const isChanged = this._isInfoChanged();
    if (!isChanged)
      return {
        isSuccess: false,
        error: { sort: 'caution', title: '변경된 정보가 없습니다', description: '세팅 정보를 변경해주세요' },
        data: {},
      };
    console.group(tag, '서버로 보낼 수 있는 정보');
    console.log('변경된 세팅 정보', this._info.current);
    console.groupEnd();
    console.log(tag, '세팅 정보 업데이트 중 ...');

    const reqData = {
      reqCode: 1001,
      reqBody: {
        accessKey: accessToken,
        id: centerId,
        conceptBordering: this._info.current[BASE_SETTING_INFO_TYPE.SETTING_RATIO][0],
        conceptEndurance: this._info.current[BASE_SETTING_INFO_TYPE.SETTING_RATIO][1],
        detailCenterSettingRatio: this._info.current[BASE_SETTING_INFO_TYPE.SETTING_RATIO_DESCRIPTION],
        detailCenterSettingCycle: this._info.current[BASE_SETTING_INFO_TYPE.SETTING_CYCLE],
        detailNextUpdate: this._info.current[BASE_SETTING_INFO_TYPE.NEXT_SETTING_DATE],
        detailRecentUpdate: this._info.current[BASE_SETTING_INFO_TYPE.RECENT_SETTING_DATE],
      },
    };
    console.log('보낸 데이터', reqData);
    const { resCode, resBody, resErr } = await this.postRequest(this.HOST.SERVER, this.PATHS.MAIN, reqData);
    if (resCode == this.RES_CODE.FAIL) {
      return {
        isSuccess: false,
        error: {
          sort: 'error',
          title: '서버 오류',
          description: ' 센터 정보를 수정하는데 실패했습니다',
        },
        data: {},
      };
    } else {
      this._info.initial = {
        ...this._info.current,
        [BASE_SETTING_INFO_TYPE.SETTING_RATIO]: [...this._info.current[BASE_SETTING_INFO_TYPE.SETTING_RATIO]],
      };
      return {
        isSuccess: true,
        error: {},
        data: {},
      };
    }
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
