import ModalView from '../view/ModalView';
import NotificationView from '../view/NotificationView';

const tag = '[LoginController]';

const LoginController = class {
  constructor() {
    // 뷰
    this._modalView = new ModalView();
    this._notificationView = new NotificationView();
  }

  /* 인터페이스 */
  init = () => {
    console.log(`${tag} init()`);

    this._modalView.setup(document.querySelector('main'));

    this._notificationView.setup(document.querySelector('[data-notification]'));

    this._lifeCycle();
  };

  /* 메서드 */

  // 라이프 사이클
  _lifeCycle = async () => {};

  // 경고 모달 보여주기
  _showAlertModal = ({ description, eventInfo }) => {
    this._modalView.showAlertModal(description, eventInfo);
  };
};

export default LoginController;
