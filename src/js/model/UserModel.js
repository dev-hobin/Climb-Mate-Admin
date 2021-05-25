import Model from '../core/Model.js';

const tag = '[UserModel]';

const UserModel = class extends Model {
  constructor() {
    super();
  }

  /* 인터페이스 */
  login = async (id, password) => {
    const reqData = {
      reqCode: 2001,
      reqBody: {
        adminLoginId: id,
        adminPassword: password,
      },
    };
    const {
      resCode,
      resBody: [accessToken],
      resErr,
    } = await this.postRequest(this.HOST.TEST_SERVER, this.PATHS.MAIN, reqData);

    if (resCode == this.RES_CODE.FAIL) {
      return {
        isSuccess: false,
        error: { sort: 'error', title: '로그인 실패', description: resErr },
        data: {},
      };
    }

    this.setCookie('accessToken', accessToken, { 'max-age': 36000 });
    return {
      isSuccess: true,
      error: {},
      data: {},
    };
  };
  logout = () => {
    this.deleteCookie('accessToken');
    location.replace('/login.html');
  };
  isLogged = () => {
    const accessToken = this.getCookie('accessToken');
    if (!accessToken) return false;
    return true;
  };

  getName = async () => {
    const reqData = {
      reqCode: 3000,
      reqBody: {
        accessKey: this.getCookie('accessToken'),
      },
    };
    const {
      resCode,
      resBody: [{ centerName }],
      resErr,
    } = await this.postRequest(this.HOST.TEST_SERVER, this.PATHS.MAIN, reqData);

    if (resCode == this.RES_CODE.FAIL) {
      this.deleteCookie('accessToken');
      return location.replace('/login.html');
    }
    return centerName;
  };
  getAccessToken = () => this.getCookie('accessToken');
};

export default UserModel;
