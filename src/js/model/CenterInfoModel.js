import Model from '../core/Model.js';

const tag = '[CenterInfoModel]';

export const CENTER_INFO_TYPE = {
  CENTER_NAME: 'CENTER_NAME',
  CENTER_ADDRESS: 'CENTER_ADDRESS',
  EXTRA_CENTER_ADDRESS: 'EXTRA_CENTER_ADDRESS',
  CALL_NUMBER: 'CALL_NUMBER',
  PHONE_CALL_NUMBER: 'PHONE_CALL_NUMBER',
  CENTER_INTRODUCE: 'CENTER_INTRODUCE',
};

const dummyInfo = {
  [CENTER_INFO_TYPE.CENTER_NAME]: '사과 클라이밍',
  [CENTER_INFO_TYPE.CENTER_ADDRESS]: '사과 클라이밍장 주소 123',
  [CENTER_INFO_TYPE.EXTRA_CENTER_ADDRESS]: '사과 클라이밍장 상세 주소 123',
  [CENTER_INFO_TYPE.CALL_NUMBER]: ['031', '1234', '5678'],
  [CENTER_INFO_TYPE.PHONE_CALL_NUMBER]: ['010', '1234', '1234'],
  [CENTER_INFO_TYPE.CENTER_INTRODUCE]: '사과 클라이밍장 소개입니다',
};

const CenterInfoModel = class extends Model {
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
      [CENTER_INFO_TYPE.CALL_NUMBER]: [...dummyInfo[CENTER_INFO_TYPE.CALL_NUMBER]],
      [CENTER_INFO_TYPE.PHONE_CALL_NUMBER]: [...dummyInfo[CENTER_INFO_TYPE.PHONE_CALL_NUMBER]],
    };
    this._info.current = {
      ...dummyInfo,
      [CENTER_INFO_TYPE.CALL_NUMBER]: [...dummyInfo[CENTER_INFO_TYPE.CALL_NUMBER]],
      [CENTER_INFO_TYPE.PHONE_CALL_NUMBER]: [...dummyInfo[CENTER_INFO_TYPE.PHONE_CALL_NUMBER]],
    };

    console.log(tag, '정보 init 완료');
    return this._info.initial;
  };
  changeExtraAddress = address => {
    this._info.current.EXTRA_CENTER_ADDRESS = address;
    console.log(tag, '상세 주소 변경', [this._info.current.EXTRA_CENTER_ADDRESS]);
  };
  changeCallNum = (number, index) => {
    this._info.current.CALL_NUMBER[index] = number;
    console.log(tag, '전화 번호 변경', [this._info.current.CALL_NUMBER[index]]);
  };
  changePhoneCallNum = (number, index) => {
    this._info.current.PHONE_CALL_NUMBER[index] = number;
    console.log(tag, '휴대폰 번호 변경', [this._info.current.PHONE_CALL_NUMBER[index]]);
  };
  changeIntroduce = introduce => {
    this._info.current.CENTER_INTRODUCE = introduce;
    console.log(tag, '센터 소개 변경', [this._info.current.CENTER_INTRODUCE]);
  };

  update = async () => {
    const isChanged = this._isInfoChanged();
    if (!isChanged)
      return {
        isSuccess: false,
        error: { sort: 'caution', title: '변경된 정보가 없습니다', description: '센터 정보를 변경해주세요' },
      };
    console.group(tag, '서버로 보낼 수 있는 정보');
    console.log('변경된 센터 정보', this._info.current);
    console.groupEnd();
    console.log(tag, '센터 정보 업데이트 중');
    await new Promise(resolve => setTimeout(resolve, 3000));
    console.log(tag, '업데이트된 센터 정보로 기존 정보 업데이트');
    this._info.initial = {
      ...this._info.current,
      [CENTER_INFO_TYPE.CALL_NUMBER]: [...this._info.current[CENTER_INFO_TYPE.CALL_NUMBER]],
      [CENTER_INFO_TYPE.PHONE_CALL_NUMBER]: [...this._info.current[CENTER_INFO_TYPE.PHONE_CALL_NUMBER]],
    };
    console.log(tag, '센터 정보 업데이트 완료 후 결과 반환');
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

export default CenterInfoModel;
