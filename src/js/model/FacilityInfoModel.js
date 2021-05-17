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

const dummyCheckInfo = {
  [FACILITY_TYPE.SHOWER_ROOM]: true,
  [FACILITY_TYPE.FITTING_ROOM]: false,
  [FACILITY_TYPE.WASHROOM]: false,
  [FACILITY_TYPE.RESTROOM]: true,
  [FACILITY_TYPE.LOCKER]: false,
  [FACILITY_TYPE.TOWEL]: true,
  [FACILITY_TYPE.LEAD_WALL]: false,
  [FACILITY_TYPE.PARKING_LOT]: true,
};
const dummyExtraInfo = {
  [FACILITY_EXTRA_INFO.PARKING_LOT]: '주차장 위치는 여기여기여기여기 있습니다',
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
  initInfo = async centerId => {
    this._checkInfo.initial = { ...dummyCheckInfo };
    this._checkInfo.current = { ...dummyCheckInfo };

    this._extraInfo.initial = { ...dummyExtraInfo };
    this._extraInfo.current = { ...dummyExtraInfo };

    return [this._checkInfo.initial, this._extraInfo.initial];
  };
  updateCheckInfo = (facility, checked) => {
    this._checkInfo.current[facility] = checked;
    console.log(tag, '체크 정보 수정', this._checkInfo.current);
  };
  updateExtraInfo = (extra, info) => {
    this._extraInfo.current[extra] = info;
    console.log(tag, '엑스트라 정보 수정', this._extraInfo.current);
  };
  update = async () => {
    const isChanged = this._isInfoChanged();
    if (!isChanged)
      return {
        isSuccess: false,
        error: { sort: 'caution', title: '변경된 정보가 없습니다', description: '시설 정보를 변경해주세요' },
      };
    console.group(tag, '서버로 보낼 수 있는 정보');
    console.log('체크된 시설 정보', this._checkInfo.current);
    console.log('주차장 위치 설명', this._extraInfo.current);
    console.groupEnd();
    console.log(tag, '시설 업데이트 중');
    await new Promise(resolve => setTimeout(resolve, 3000));
    console.log(tag, '업데이트된 시설정보로 기존 정보 업데이트');
    this._checkInfo.initial = { ...this._checkInfo.current };
    this._extraInfo.initial = { ...this._extraInfo.current };
    console.log(tag, '시설 업데이트 완료 후 결과 반환');
    return {
      isSuccess: true,
      error: '',
    };
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
};

export default FacilityInfoModel;
