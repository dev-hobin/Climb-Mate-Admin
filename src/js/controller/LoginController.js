import LoginView from '../view/LoginView';
import NotificationView from '../view/NotificationView';

const tag = '[LoginController]';

const LoginController = class {
  constructor() {
    // 뷰
    this._loginView = new LoginView();
    this._notificationView = new NotificationView();
  }

  /* 인터페이스 */
  init = () => {
    console.log(`${tag} init()`);

    this._loginView.setup(document.querySelector('[data-login-view]')).on('@login', event => this._login(event.detail));
    this._notificationView.setup(document.querySelector('[data-notification]'));

    this._lifeCycle();
  };

  /* 메서드 */

  // 라이프 사이클
  _lifeCycle = async () => {};

  // 로그인
  _login = async ({ id, password }) => console.log({ id, password });
};

export default LoginController;
