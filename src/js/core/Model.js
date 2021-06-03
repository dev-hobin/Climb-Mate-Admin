const tag = '[Model]';

const Model = class {
  DATA_TYPE = {
    FORM_DATA: 'form-data',
    JSON: 'json',
  };
  HOST = {
    SERVER: 'https://climbmate.co.kr',
    TEST_SERVER: 'http://13.209.4.105',
  };
  PATHS = {
    MAIN: '/AdminIndex.php',
    SINGLE_IMAGE: {
      PRICE: '/goodsPhotoUpload',
      LEVEL: '/settingLevelUpload',
    },
    MULTI_IMAGES: {
      BANNER: '/homeBannerUpload',
      BORDERING: '/settingImageUploadBolder',
      ENDURANCE: '/settingImageUploadEndurance',
    },
  };
  RES_CODE = {
    SUCCESS: 200,
    FAIL: 500,
  };

  constructor() {
    this._resStatus = null;
  }

  // 서버와 통신하는 메소드 (공통)
  _sendHttpRequest = async (method, host, path, data = '', dataType = '') => {
    let response;
    const url = host + path;

    let header;
    let body;
    switch (dataType) {
      case this.DATA_TYPE.FORM_DATA:
        header = { 'Content-Type': 'multipart/form-data' };
        body = data;
        break;
      case this.DATA_TYPE.JSON:
        header = { 'Content-Type': 'application/json' };
        body = JSON.stringify(data);
        break;
      default:
        header = {};
        body = JSON.stringify(data);
        break;
    }
    try {
      response = await fetch(url, {
        method,
        header,
        body,
      });

      // 서버에서 리턴받은 resStatus 저장
      this._resStatus = response.status;
      if (!this._resStatus) throw `${tag} resStatus is null`;

      // 성공 예외처리
      if (this._resStatus === 200) return response.json();
      if (this._resStatus === 201) return response.json();
      if (this._resStatus === 201) return { stats: 'ok' };
      if (this._resStatus === 206) return response.json();

      // 실패 - 클라이언트 오류
      if (this._resStatus === 400)
        response.json().then(obj => {
          throw `Status Code : ${this._resStatus} | 유효성 검사 통과 실패 (${obj.code} 이 없습니다)`;
        });
      if (this._resStatus === 401)
        response.json().then(obj => {
          if (obj.code.includes('Authorization'))
            throw `Status Code : ${this._resStatus} | Authorization 헤더키가 없습니다`;
          if (obj.code.includes('no_verified')) throw `Status Code : ${this._resStatus} | 확인되지 않은 사용자입니다`;
          if (obj.code.includes('cannot')) throw `Status Code : ${this._resStatus} | ${obj.code} 대한 권한이 없습니다`;
          if (obj.code.includes('signin_token_expired'))
            throw `Status Code : ${this._resStatus} | ${obj.code} 인증 토큰이 만료되었습니다`;
          throw `Status Code : ${this._resStatus} | ${obj.code}`;
        });

      if (this._resStatus === 403) throw `Status Code : ${this._resStatus} | 금지된 페이지 - 관리자`;
      if (this._resStatus === 404) return { stats: '404 Not Found' };
      if (this._resStatus === 405) throw `Status Code : ${this._resStatus} | HTTP Method를 사용할 수 없습니다`;
      if (this._resStatus === 408) throw `Status Code : ${this._resStatus} | 요청 시간을 초과했습니다`;
      if (this._resStatus === 409) {
        response.json().then(obj => {
          if (obj.code.includes('already_exist_user'))
            throw `Status Code : ${this._resStatus} | 이미 존재하는 유저입니다`;
          throw `Status Code : ${this._resStatus} | 서버가 요청을 처리하는데 충돌이 발생하였습니다`;
        });
      }
      if (this._resStatus === 410) throw `Status Code : ${this._resStatus} | 영구적으로 사용 불가능한 페이지입니다`;
      if (this._resStatus === 429) throw `Status Code : ${this._resStatus} | 너무 잦은 요청입니다`;
      if (this._resStatus === 451) throw `Status Code : ${this._resStatus} | 법적으로 막힌 페이지입니다`;

      // 실패 - 서버 오류
      if (this._resStatus === 500) throw `Status Code : ${this._resStatus} | 내부 서버오류입니다`;
      if (this._resStatus === 501) throw `Status Code : ${this._resStatus} | 아직 기능이 없습니다`;
      if (this._resStatus === 502) throw `Status Code : ${this._resStatus} | 클라이언트의 요청이 유실되었습니다`;
      if (this._resStatus === 503)
        throw `Status Code : ${this._resStatus} | 서버가 고장났습니다 (디도스 또는 유지보수중)`;
      if (this._resStatus === 504)
        throw `Status Code : ${this._resStatus} | 서버 게이트웨이에 문제가 생겨 시간이 초과되었습니다`;
      if (this._resStatus === 505)
        throw `Status Code : ${this._resStatus} | http 버전이 달라서 요청을 처리할 수 없습니다`;

      return response.json();
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  // GET
  getRequest = async (host, path, params = '') => {
    const query = Object.keys(params)
      .map(key => {
        if (!params[key]) return encodeURIComponent(key);
        else return `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`;
      })
      .join('&');
    return await this._sendHttpRequest('GET', host, path + '?' + query);
  };

  // POST
  postRequest = async (host, path, data, dataType = this.DATA_TYPE.JSON) => {
    return await this._sendHttpRequest('POST', host, path, data, dataType);
  };

  // PUT
  putRequest = async (host, path, data) => {
    return await this._sendHttpRequest('PUT', host, path, data);
  };

  // PATCH
  patchRequest = async (host, path, data) => {
    return await this._sendHttpRequest('PATCH', host, path, data);
  };

  // DELETE
  deleteRequest = async (host, path, data) => {
    return await this._sendHttpRequest('DELETE', host, path, data);
  };

  getCookie = name => {
    let matches = document.cookie.match(
      new RegExp('(?:^|; )' + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + '=([^;]*)')
    );
    return matches ? decodeURIComponent(matches[1]) : undefined;
  };
  setCookie = (name, value, options = {}) => {
    options = {
      path: '/',
      ...options,
    };

    if (options.expires instanceof Date) {
      options.expires = options.expires.toUTCString();
    }

    let updatedCookie = encodeURIComponent(name) + '=' + encodeURIComponent(value);

    for (let optionKey in options) {
      updatedCookie += '; ' + optionKey;
      let optionValue = options[optionKey];
      if (optionValue !== true) {
        updatedCookie += '=' + optionValue;
      }
    }
    document.cookie = updatedCookie;
  };
  deleteCookie = name => {
    this.setCookie(name, '', {
      'max-age': -1,
    });
  };
};

export default Model;
