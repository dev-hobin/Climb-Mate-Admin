import Model from '../core/Model.js';

const tag = '[FacilityUpdateModel]';

export const FACILITY_TYPE = {
  SHOWER_ROOM: 'shower-room',
  FITTING_ROOM: 'fitting-room',
  WASHROOM: 'washroom',
  RESTROOM: 'restroom',
  LOCKER: 'locker',
  TOWEL: 'towel',
  LEAD_WALL: 'lead-wall',
};

const dummyCheckInfo = {
  [FACILITY_TYPE.SHOWER_ROOM]: true,
  [FACILITY_TYPE.FITTING_ROOM]: false,
  [FACILITY_TYPE.WASHROOM]: false,
  [FACILITY_TYPE.RESTROOM]: true,
  [FACILITY_TYPE.LOCKER]: false,
  [FACILITY_TYPE.TOWEL]: true,
  [FACILITY_TYPE.LEAD_WALL]: false,
};

const FacilityUpdateModel = class extends Model {
  constructor() {
    super();
    this._checkInfo = {
      initial: {},
      current: {},
    };
  }

  /* 인터페이스 */
  initInfo = async centerId => {
    this._checkInfo.initial = { ...dummyCheckInfo };
    this._checkInfo.current = { ...dummyCheckInfo };
    return this._checkInfo.initial;
  };
  updateCheckInfo = (facility, checked) => {
    this._checkInfo.current[facility] = checked;
    console.log(tag, '체크 정보 수정', this._checkInfo.current);
  };

  update = async () => {
    const isChanged = this._isInfoChanged();
    if (!isChanged)
      return {
        isSuccess: false,
        error: { sort: 'caution', title: '변경된 정보가 없습니다', description: '시설 정보를 변경해주세요' },
      };
    console.log(tag, '시설 업데이트 중');
    await new Promise(resolve => setTimeout(resolve, 3000));
    console.log(tag, '업데이트된 시설정보로 기존 정보 업데이트');
    this._checkInfo.initial = { ...this._checkInfo.current };
    console.log(tag, '시설 업데이트 완료 후 결과 반환');
    return {
      isSuccess: true,
      error: '',
    };
  };

  _isInfoChanged = () => {
    const initial = this._checkInfo.initial;
    const current = this._checkInfo.current;

    for (const [key, value] of Object.entries(current)) {
      if (value !== initial[key]) return true;
    }
    return false;
  };
};

export default FacilityUpdateModel;
