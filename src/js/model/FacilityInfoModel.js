import Model from '../core/Model.js';

const tag = '[FacilityInfoModel]';

export const FACILITY_TYPE = {
  SHOWER_ROOM: 'shower-room',
  FITTING_ROOM: 'fitting-room',
  WASHROOM: 'washroom',
  RESTROOM: 'restroom',
  LOCKER: 'locker',
  TOWEL: 'towel',
  LEAD_WALL: 'lead-wall',
  PARKING_LOT: 'parking-lot',
};
export const FACILITY_EXTRA_INFO = {
  PARKING_LOT: 'parking-lot-health-description',
};

const FACILITY_NAME_TO_TYPE_KEY = {
  샤워실: 'SHOWER_ROOM',
  주차장: 'PARKING_LOT',
  락커: 'LOCKER',
  탈의실: 'FITTING_ROOM',
  세족실: 'WASHROOM',
  휴게실: 'RESTROOM',
  수건: 'TOWEL',
  리드연습: 'LEAD_WALL',
};

const FacilityInfoModel = class extends Model {
  constructor() {
    super();
    this._checkInfo = {
      initial: {},
      current: {},
    };
    this._extraInfo = {
      initial: {},
      current: {},
    };
  }

  /* 인터페이스 */
  initInfo = async accessToken => {
    const reqData = {
      reqCode: 3004,
      reqBody: { accessKey: accessToken },
    };
    const {
      resCode,
      resBody: {
        centerFacility,
        detailCenterParkinglot: { detailCenterParkinglot },
      },
      resErr,
    } = await this.postRequest(this.HOST.TEST_SERVER, this.PATHS.MAIN, reqData);

    if (resCode == this.RES_CODE.FAIL)
      return {
        isSuccess: false,
        error: { sort: 'error', title: '서버 오류', description: resErr },
        data: {},
      };

    const checkInfo = this._makeCheckInfo(centerFacility);
    this._checkInfo.initial = { ...checkInfo };
    this._checkInfo.current = { ...checkInfo };

    const extraInfo = this._makeExtraInfo(detailCenterParkinglot);
    this._extraInfo.initial = { ...extraInfo };
    this._extraInfo.current = { ...extraInfo };

    return {
      isSuccess: true,
      error: {},
      data: {
        checkInfo: this._checkInfo.initial,
        extraInfo: this._extraInfo.initial,
      },
    };
  };
  updateCheckInfo = (facility, checked) => {
    this._checkInfo.current[facility] = checked;
    console.log(tag, '체크 정보 수정', this._checkInfo.current);
  };
  updateExtraInfo = (extra, info) => {
    this._extraInfo.current[extra] = info;
    console.log(tag, '추가 정보 수정', this._extraInfo.current);
  };
  update = async (accessToken, centerId) => {
    const isChanged = this._isInfoChanged();
    if (!isChanged)
      return {
        isSuccess: false,
        error: { sort: 'caution', title: '변경된 정보가 없습니다', description: '시설 정보를 변경해주세요' },
        data: {},
      };
    console.group(tag, '서버로 보낼 수 있는 정보');
    console.log('체크된 시설 정보', this._checkInfo.current);
    console.log('주차장 위치 설명', this._extraInfo.current);
    console.groupEnd();
    console.log(tag, '시설 업데이트 중...');

    const reqData = {
      reqCode: 1100,
      reqBody: {
        accessKey: accessToken,
        id: centerId,
        showerRoomCheck: this._checkInfo.current[FACILITY_TYPE.SHOWER_ROOM] ? 1 : 2,
        fittingRoomCheck: this._checkInfo.current[FACILITY_TYPE.FITTING_ROOM] ? 1 : 2,
        washRoomCheck: this._checkInfo.current[FACILITY_TYPE.WASHROOM] ? 1 : 2,
        restRoomCheck: this._checkInfo.current[FACILITY_TYPE.RESTROOM] ? 1 : 2,
        lockerRoomCheck: this._checkInfo.current[FACILITY_TYPE.LOCKER] ? 1 : 2,
        towelCheck: this._checkInfo.current[FACILITY_TYPE.TOWEL] ? 1 : 2,
        parkingLotCheck: this._checkInfo.current[FACILITY_TYPE.PARKING_LOT] ? 1 : 2,
        leadPracticeCheck: this._checkInfo.current[FACILITY_TYPE.LEAD_WALL] ? 1 : 2,
        detailCenterParkinglot: this._extraInfo.current[FACILITY_EXTRA_INFO.PARKING_LOT],
      },
    };
    console.log('보낸 데이터', reqData);
    const { resCode, resBody, resErr } = await this.postRequest(this.HOST.TEST_SERVER, this.PATHS.MAIN, reqData);
    if (resCode == this.RES_CODE.FAIL) {
      return {
        isSuccess: false,
        error: {
          sort: 'error',
          title: '서버 오류',
          description: '시설 정보를 수정하는데 실패했습니다',
        },
        data: {},
      };
    } else {
      this._checkInfo.initial = { ...this._checkInfo.current };
      this._extraInfo.initial = { ...this._extraInfo.current };
      return {
        isSuccess: true,
        error: {},
        data: {},
      };
    }
  };

  // 메소드
  _isInfoChanged = () => {
    const facilityInitial = this._checkInfo.initial;
    const facilityCurrent = this._checkInfo.current;

    const extraInitial = this._extraInfo.initial;
    const extaCurrent = this._extraInfo.current;

    for (const [key, value] of Object.entries(facilityCurrent)) {
      if (value !== facilityInitial[key]) return true;
    }
    if (extraInitial[FACILITY_EXTRA_INFO.PARKING_LOT] !== extaCurrent[FACILITY_EXTRA_INFO.PARKING_LOT]) return true;
    return false;
  };
  // 체크 정보 만들기
  _makeCheckInfo = facilities => {
    const checkInfo = {};
    facilities.forEach(facilityInfo => {
      const { toolName: facilityName, toolCheck } = facilityInfo;
      const typeKey = FACILITY_NAME_TO_TYPE_KEY[facilityName];
      const isChecked = toolCheck == 1 ? true : false;

      checkInfo[FACILITY_TYPE[typeKey]] = isChecked;
    });
    return checkInfo;
  };
  // 추가 정보 만들기
  _makeExtraInfo = description => {
    const extraInfo = {
      'parking-lot-health-description': description,
    };
    return extraInfo;
  };
};

export default FacilityInfoModel;
