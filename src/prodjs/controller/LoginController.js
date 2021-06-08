import LoginView from '../view/LoginView';
import NotificationView from '../view/NotificationView';

import UserModel from '../model/UserModel';

const tag = '[LoginController]';

const LoginController = class {
  constructor() {
    // 뷰
    this._loginView = new LoginView();
    this._notificationView = new NotificationView();

    // 모델
    this._userModel = new UserModel();
  }

  /* 인터페이스 */
  init = () => {
    this._loginView //
      .setup(document.querySelector('[data-login-view]'))
      .on('@login', event => this._login(event));

    this._notificationView //
      .setup(document.querySelector('[data-notification]'));

    this._lifeCycle();
  };

  /* 메서드 */

  // 라이프 사이클
  _lifeCycle = async () => {
    if (this._userModel.isLogged()) return location.replace('/admin/baseInfo');
  };

  // 중복 클릭 방지
  _setClickable = (view, clickable) => {
    if (clickable) {
      view.clickable = true;
    } else {
      view.clickable = false;
    }
  };

  // 로그인
  _login = async event => {
    const { view, id, password } = event.detail;
    this._setClickable(view, false);

    const { isSuccess, error, data } = await this._userModel.login(id, password);
    if (!isSuccess) {
      this._setClickable(view, true);
      const { sort, title, description } = error;
      this._notificationView.addNotification(sort, title, description, true);
    } else {
      location.href = '/admin/baseInfo';
    }
  };
};

export default LoginController;
