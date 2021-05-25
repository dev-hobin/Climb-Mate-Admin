import Model from '../core/Model.js';

const tag = '[BaseCenterInfoModel]';

export const BASE_CENTER_INFO_TYPE = {
  CENTER_NAME: 'CENTER_NAME',
  CENTER_ADDRESS: 'CENTER_ADDRESS',
  EXTRA_CENTER_ADDRESS: 'EXTRA_CENTER_ADDRESS',
  CALL_NUMBER: 'CALL_NUMBER',
  PHONE_CALL_NUMBER: 'PHONE_CALL_NUMBER',
  CENTER_INTRODUCE: 'CENTER_INTRODUCE',
};

const BaseCenterInfoModel = class extends Model {
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
      reqCode: 3000,
      reqBody: {
        accessKey: accessToken,
      },
    };
    const {
      resCode,
      resBody: [{ centerName, centerAddress, centerDetailAddress, centerNumber, centerPhoneNumber, detailComment }],
      resErr,
    } = await this.postRequest(this.HOST.TEST_SERVER, this.PATHS.MAIN, reqData);

    if (resCode == this.RES_CODE.FAIL)
      return {
        isSuccess: false,
        error: {
          sort: 'error',
          title: '서버 오류',
          description: '센터 정보를 가져오는데 실패했습니다',
        },
        data: {},
      };

    const centerNumbers = centerNumber.split('-');
    const centerPhoneNumbers = centerPhoneNumber.split('-');
    this._info.initial = {
      [BASE_CENTER_INFO_TYPE.CENTER_NAME]: centerName,
      [BASE_CENTER_INFO_TYPE.CENTER_ADDRESS]: centerAddress,
      [BASE_CENTER_INFO_TYPE.EXTRA_CENTER_ADDRESS]: centerDetailAddress,
      [BASE_CENTER_INFO_TYPE.CALL_NUMBER]: [centerNumbers[0], centerNumbers[1], centerNumbers[2]],
      [BASE_CENTER_INFO_TYPE.PHONE_CALL_NUMBER]: [centerPhoneNumbers[0], centerPhoneNumbers[1], centerPhoneNumbers[2]],
      [BASE_CENTER_INFO_TYPE.CENTER_INTRODUCE]: detailComment,
    };
    this._info.current = {
      [BASE_CENTER_INFO_TYPE.CENTER_NAME]: centerName,
      [BASE_CENTER_INFO_TYPE.CENTER_ADDRESS]: centerAddress,
      [BASE_CENTER_INFO_TYPE.EXTRA_CENTER_ADDRESS]: centerDetailAddress,
      [BASE_CENTER_INFO_TYPE.CALL_NUMBER]: [centerNumbers[0], centerNumbers[1], centerNumbers[2]],
      [BASE_CENTER_INFO_TYPE.PHONE_CALL_NUMBER]: [centerPhoneNumbers[0], centerPhoneNumbers[1], centerPhoneNumbers[2]],
      [BASE_CENTER_INFO_TYPE.CENTER_INTRODUCE]: detailComment,
    };

    return {
      isSuccess: true,
      error: {},
      data: {
        centerInfo: this._info.initial,
      },
    };
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
      [BASE_CENTER_INFO_TYPE.CALL_NUMBER]: [...this._info.current[BASE_CENTER_INFO_TYPE.CALL_NUMBER]],
      [BASE_CENTER_INFO_TYPE.PHONE_CALL_NUMBER]: [...this._info.current[BASE_CENTER_INFO_TYPE.PHONE_CALL_NUMBER]],
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

export default BaseCenterInfoModel;
