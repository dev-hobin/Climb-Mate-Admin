import HeaderView from '../view/HeaderView';
import SidebarView from '../view/SidebarView';
import ModalView from '../view/ModalView';
import NotificationView from '../view/NotificationView';

const tag = '[NoticeController]';

const NoticeController = class {
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
      .on('@toggleSidebar', () => this._toggleSidebar())
      .on('@toggleAdminMenu', () => this._toggleAdminMenu())
      .on('@clickAdminMenu', event => console.log(event));

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
    // * 일단 공지사항 페이지로 들어왔다고 가정 -> 나중에는 url 값 받아서 구분해야함
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

  // 헤더 어드민 메뉴 토글
  _toggleAdminMenu = () => {
    this._headerView.toggleAdminMenu();
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
    const view = event.currentTarget;
    this._setClickable(view, false);

    const { description, eventInfo } = event.detail;
    this._modalView.showAlertModal(description, eventInfo);

    this._setClickable(view, true);
  };
};

export default NoticeController;
