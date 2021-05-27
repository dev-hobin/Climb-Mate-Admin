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
    const reqData = {
      reqCode: 3003,
      reqBody: {
        accessKey: accessToken,
      },
    };
    const {
      resCode,
      resBody: [{ centerUrl = '', centerUrl2 = '' }],
      resErr,
    } = await this.postRequest(this.HOST.TEST_SERVER, this.PATHS.MAIN, reqData);

    console.log([centerUrl, centerUrl2]);
    if (resCode == this.RES_CODE.FAIL)
      return {
        isSuccess: false,
        error: {
          sort: 'error',
          title: '서버 오류',
          description: '소셜 정보를 가져오는데 실패했습니다',
        },
        data: {},
      };

    const [checkInfo, urlInfo] = this._makeInfo(centerUrl, centerUrl2);

    this._checkInfo.initial = { ...checkInfo };
    this._checkInfo.current = { ...checkInfo };

    this._urlInfo.initial = { ...urlInfo };
    this._urlInfo.current = { ...urlInfo };

    return {
      isSuccess: true,
      error: {},
      data: {
        checkInfo: this._checkInfo.initial,
        urlInfo: this._urlInfo.initial,
      },
    };
  };
  checkSocial = socialType => {
    this._checkInfo.current[socialType] = this._checkInfo.current[socialType] ? false : true;
    console.log(tag, '체크 정보 변경', [socialType, this._checkInfo.current[socialType]]);
  };
  changeSocialUrl = (socialType, url) => {
    this._urlInfo.current[socialType] = url;
    console.log(tag, 'url 정보 변경', [socialType, this._urlInfo.current[socialType]]);
  };

  update = async (accessToken, centerId) => {
    if (!this._isValidateUrl())
      return {
        isSuccess: false,
        error: {
          sort: 'caution',
          title: '소셜 정보 업데이트 실패',
          description: '체크된 아이템에 적절한 URL을 입력해주세요',
        },
        data: {},
      };
    if (!this._isInfoChanged())
      return {
        isSuccess: false,
        error: { sort: 'caution', title: '소셜 정보 업데이트 실패', description: '변경된 소셜 정보가 없습니다' },
        data: {},
      };
    console.group(tag, '서버로 보낼 수 있는 정보');
    console.log('변경된 check 정보', this._checkInfo.current);
    console.log('변경된 url 정보', this._urlInfo.current);
    console.groupEnd();
    console.log(tag, '소셜 정보 업데이트 중...');

    const [centerUrl = '', centerUrl2 = ''] = Object.entries(this._checkInfo.current)
      .filter(info => {
        const [infoType, isChecked] = info;
        if (isChecked) return true;
        else return false;
      })
      .map(item => {
        const [infoType, isChecked] = item;
        const url = this._urlInfo.current[infoType];
        return url;
      });

    const reqData = {
      reqCode: 1003,
      reqBody: {
        accessKey: accessToken,
        id: centerId,
        centerUrl,
        centerUrl2,
      },
    };
    console.log('보낸 데이터', reqData);
    const { resCode, resBody, resErr } = await this.postRequest(this.HOST.TEST_SERVER, this.PATHS.MAIN, reqData);
    console.log('결과', { resCode, resBody, resErr });
    if (resCode == this.RES_CODE.FAIL) {
      return {
        isSuccess: false,
        error: {
          sort: 'error',
          title: '서버 오류',
          description: '소셜 정보를 수정하는데 실패했습니다',
        },
        data: {},
      };
    } else {
      this._checkInfo.initial = { ...this._checkInfo.current };
      this._urlInfo.initial = { ...this._urlInfo.current };
      return {
        isSuccess: true,
        error: {},
        data: {},
      };
    }
  };

  // 메소드
  _makeInfo = (url1, url2) => {
    const urls = [url1, url2];
    const checkInfo = {
      [BASE_SOCIAL_INFO_TYPE.INSTAGRAM]: false,
      [BASE_SOCIAL_INFO_TYPE.FACEBOOK]: false,
      [BASE_SOCIAL_INFO_TYPE.NAVER_BAND]: false,
      [BASE_SOCIAL_INFO_TYPE.NAVER_CAFE]: false,
      [BASE_SOCIAL_INFO_TYPE.DAUM_CAFE]: false,
      [BASE_SOCIAL_INFO_TYPE.OTHER]: false,
    };
    const urlInfo = {
      [BASE_SOCIAL_INFO_TYPE.INSTAGRAM]: '',
      [BASE_SOCIAL_INFO_TYPE.FACEBOOK]: '',
      [BASE_SOCIAL_INFO_TYPE.NAVER_BAND]: '',
      [BASE_SOCIAL_INFO_TYPE.NAVER_CAFE]: '',
      [BASE_SOCIAL_INFO_TYPE.DAUM_CAFE]: '',
      [BASE_SOCIAL_INFO_TYPE.OTHER]: '',
    };

    urls.forEach(url => {
      if (url.includes('www.instagram.com')) {
        checkInfo[BASE_SOCIAL_INFO_TYPE.INSTAGRAM] = true;
        urlInfo[BASE_SOCIAL_INFO_TYPE.INSTAGRAM] = url;
      } else if (url.includes('facebook.com')) {
        checkInfo[BASE_SOCIAL_INFO_TYPE.FACEBOOK] = true;
        urlInfo[BASE_SOCIAL_INFO_TYPE.FACEBOOK] = url;
      } else if (url.includes('cafe.daum.net')) {
        checkInfo[BASE_SOCIAL_INFO_TYPE.DAUM_CAFE] = true;
        urlInfo[BASE_SOCIAL_INFO_TYPE.DAUM_CAFE] = url;
      } else if (url.includes('band.us')) {
        checkInfo[BASE_SOCIAL_INFO_TYPE.NAVER_BAND] = true;
        urlInfo[BASE_SOCIAL_INFO_TYPE.NAVER_BAND] = url;
      } else if (url.includes('cafe.naver.com')) {
        checkInfo[BASE_SOCIAL_INFO_TYPE.NAVER_CAFE] = true;
        urlInfo[BASE_SOCIAL_INFO_TYPE.NAVER_CAFE] = url;
      } else if (url.length > 0) {
        checkInfo[BASE_SOCIAL_INFO_TYPE.OTHER] = true;
        urlInfo[BASE_SOCIAL_INFO_TYPE.OTHER] = url;
      }
    });

    return [checkInfo, urlInfo];
  };
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
  _isValidateUrl = () => {
    const currentCheckInfo = this._checkInfo.current;
    const currentUrlInfo = this._urlInfo.current;

    for (const [socialName, check] of Object.entries(currentCheckInfo)) {
      if (!check) continue;
      if (!this._validateUrl(socialName, currentUrlInfo[socialName])) return false;
    }
    return true;
  };

  _validateUrl = (socialName, url) => {
    if (url.trim().length === 0) return false;
    switch (true) {
      case socialName === BASE_SOCIAL_INFO_TYPE.INSTAGRAM:
        if (url.trim().includes('www.instagram.com')) return true;
        else return false;
      case socialName === BASE_SOCIAL_INFO_TYPE.FACEBOOK:
        if (url.trim().includes('facebook.com')) return true;
        else return false;
      case socialName === BASE_SOCIAL_INFO_TYPE.DAUM_CAFE:
        if (url.trim().includes('cafe.daum.net')) return true;
        else return false;
      case socialName === BASE_SOCIAL_INFO_TYPE.NAVER_BAND:
        if (url.trim().includes('band.us')) return true;
        else return false;
      case socialName === BASE_SOCIAL_INFO_TYPE.NAVER_CAFE:
        if (url.trim().includes('cafe.naver.com')) return true;
        else return false;
      default:
        return true;
    }
  };
};

export default BaseSocialInfoModel;
