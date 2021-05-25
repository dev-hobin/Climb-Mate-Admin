import Model from '../core/Model.js';

const tag = '[BaseSocialInfoModel]';

export const BASE_SOCIAL_INFO_TYPE = {
  INSTAGRAM: 'instagram',
  FACEBOOK: 'facebook',
  NAVER_BAND: 'naver-band',
  NAVER_CAFE: 'naver-cafe',
  DAUM_CAFE: 'daum-cafe',
  OTHER: 'other',
};

const dummyCheckInfo = {
  [BASE_SOCIAL_INFO_TYPE.INSTAGRAM]: true,
  [BASE_SOCIAL_INFO_TYPE.FACEBOOK]: false,
  [BASE_SOCIAL_INFO_TYPE.NAVER_BAND]: false,
  [BASE_SOCIAL_INFO_TYPE.NAVER_CAFE]: true,
  [BASE_SOCIAL_INFO_TYPE.DAUM_CAFE]: false,
  [BASE_SOCIAL_INFO_TYPE.OTHER]: false,
};
const dummyUrlInfo = {
  [BASE_SOCIAL_INFO_TYPE.INSTAGRAM]: '인스타 url',
  [BASE_SOCIAL_INFO_TYPE.FACEBOOK]: '',
  [BASE_SOCIAL_INFO_TYPE.NAVER_BAND]: '',
  [BASE_SOCIAL_INFO_TYPE.NAVER_CAFE]: '카페 url',
  [BASE_SOCIAL_INFO_TYPE.DAUM_CAFE]: '',
  [BASE_SOCIAL_INFO_TYPE.OTHER]: '',
};

const BaseSocialInfoModel = class extends Model {
  constructor() {
    super();

    this._checkInfo = {
      initial: {},
      current: {},
    };
    this._urlInfo = {
      initial: {},
      current: {},
    };
  }

  /* 인터페이스 */
  initInfo = async accessToken => {
    console.group('소셜 정보 더미 데이터');
    console.log('체크 정보');
    console.log(dummyCheckInfo);
    console.log('url 정보');
    console.log(dummyUrlInfo);
    console.groupEnd();

    const reqData = {
      reqCode: 3003,
      reqBody: {
        accessKey: accessToken,
      },
    };
    const {
      resCode,
      resBody: [{ centerUrl, centerUrl2 }],
      resErr,
    } = await this.postRequest(this.HOST.TEST_SERVER, this.PATHS.MAIN, reqData);

    console.log('소셜 정보', { centerUrl, centerUrl2 });

    this._checkInfo.initial = { ...dummyCheckInfo };
    this._checkInfo.current = { ...dummyCheckInfo };

    this._urlInfo.initial = { ...dummyUrlInfo };
    this._urlInfo.current = { ...dummyUrlInfo };

    console.log(tag, '소셜 정보 init 완료');
    return [this._checkInfo.initial, this._urlInfo.initial];
  };
  checkSocial = socialType => {
    this._checkInfo.current[socialType] = this._checkInfo.current[socialType] ? false : true;
    console.log(tag, '체크 정보 변경', [socialType, this._checkInfo.current[socialType]]);
  };
  changeSocialUrl = (socialType, url) => {
    this._urlInfo.current[socialType] = url;
    console.log(tag, 'url 정보 변경', [socialType, this._urlInfo.current[socialType]]);
  };

  update = async () => {
    console.log('isUrlEmpty', this._isUrlEmpty());
    if (this._isUrlEmpty())
      return {
        isSuccess: false,
        error: {
          sort: 'caution',
          title: '소셜 정보 업데이트 실패',
          description: '체크된 아이템에 적절한 URL을 입력해주세요',
        },
      };
    console.log('infoChange', this._isInfoChanged());
    if (!this._isInfoChanged())
      return {
        isSuccess: false,
        error: { sort: 'caution', title: '소셜 정보 업데이트 실패', description: '변경된 소셜 정보가 없습니다' },
      };
    console.group(tag, '서버로 보낼 수 있는 정보');
    console.log('변경된 check 정보', this._checkInfo.current);
    console.log('변경된 url 정보', this._urlInfo.current);
    console.groupEnd();
    console.log(tag, '소셜 정보 업데이트 중');
    await new Promise(resolve => setTimeout(resolve, 3000));
    console.log(tag, '업데이트된 소셜 정보로 기존 정보 업데이트');
    this._checkInfo.initial = { ...this._checkInfo.current };
    this._urlInfo.initial = { ...this._urlInfo.current };
    console.log(tag, '소셜 정보 업데이트 완료 후 결과 반환');
    return {
      isSuccess: true,
      error: '',
    };
  };

  // 메소드
  _isInfoChanged = () => {
    const initialCheckInfo = this._checkInfo.initial;
    const currentCheckInfo = this._checkInfo.current;

    const initialUrlInfo = this._urlInfo.initial;
    const currentUrlInfo = this._urlInfo.current;

    for (const [socialName, check] of Object.entries(currentCheckInfo)) {
      // 체크 박스 변경사항 먼저 체크
      if (initialCheckInfo[socialName] !== check) return true;
      // 체크 박스 변경된 것이 없고 false 값이면 다음 루프로
      if (!check) continue;
      // 체크 박스 변경된 것이 없지만 true 값이면 url 비교
      if (initialUrlInfo[socialName] !== currentUrlInfo[socialName]) return true;
    }
    return false;
  };
  _isUrlEmpty = () => {
    const currentCheckInfo = this._checkInfo.current;
    const currentUrlInfo = this._urlInfo.current;

    for (const [socialName, check] of Object.entries(currentCheckInfo)) {
      if (!check) continue;
      if (currentUrlInfo[socialName].trim().length === 0) return true;
    }
    return false;
  };
};

export default BaseSocialInfoModel;
