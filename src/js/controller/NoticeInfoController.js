import HeaderView from '../view/HeaderView';
import SidebarView from '../view/SidebarView';
import ModalView from '../view/ModalView';
import NotificationView from '../view/NotificationView';

const tag = '[NoticeInfoController]';

const NoticeInfoController = class {
  constructor() {
    // 뷰
    this._headerView = new HeaderView();
    this._sidebarView = new SidebarView();
    this._modalView = new ModalView();
    this._notificationView = new NotificationView();
  }

  /* 인터페이스 */

  init = () => {
    this._headerView //
      .setup(document.querySelector(`[data-header]`))
      .on('@toggleSidebar', () => this._toggleSidebar());

    this._sidebarView //
      .setup(document.querySelector(`[data-sidebar]`))
      .on('@toggleSideMenu', event => this._toggleSideMenu(event));

    this._modalView
      .setup(document.querySelector('main'))
      .on('@deleteBorderingItem', event => this._deleteBorderingImage(event))
      .on('@deleteEnduranceItem', event => this._deleteEnduranceImage(event));

    this._notificationView.setup(document.querySelector('[data-notification]'));

    this._lifeCycle();
  };

  /* 메서드 */

  // 라이프 사이클
  _lifeCycle = async () => {
    /* 사이드바 메뉴 설정 */
    this._sidebarView.initMenu({
      depth1: 'centerInfo',
      depth2: 'notice',
    });
  };

  // 중복 클릭 방지
  _setClickable = (view, clickable) => {
    if (clickable) {
      view.clickable = true;
    } else {
      view.clickable = false;
    }
  };

  // 사이드바 토글
  _toggleSidebar = () => {
    this._sidebarView.toggleSidebar();
  };
  // 사이드 메뉴 토글
  _toggleSideMenu = event => {
    const { menu } = event.detail;
    this._sidebarView.toggleSideMenu(menu);
  };
  // 경고 모달 보여주기
  _showAlertModal = event => {
    const { view, description, eventInfo } = event.detail;
    this._setClickable(view, false);

    this._modalView.showAlertModal(description, eventInfo);

    this._setClickable(view, true);
  };
};

export default NoticeInfoController;
