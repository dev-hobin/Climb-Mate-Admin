import HeaderView from '../view/HeaderView';
import SidebarView from '../view/SidebarView';
import ModalView from '../view/ModalView';
import NotificationView from '../view/NotificationView';

import CenterInfoView from '../view/CenterInfoView';

import CenterInfoModel from '../model/CenterInfoModel';

const tag = '[BaseInfoController]';

const BaseInfoController = class {
  constructor() {
    // 뷰
    this._headerView = new HeaderView();
    this._sidebarView = new SidebarView();
    this._modalView = new ModalView();
    this._notificationView = new NotificationView();
    this._centerInfoView = new CenterInfoView();

    // 모델
    this._centerInfoModel = new CenterInfoModel();
  }

  /* 인터페이스 */

  init = () => {
    console.log(`${tag} init()`);

    this._headerView //
      .setup(document.querySelector(`[data-header]`))
      .on('@toggleSidebar', () => this._toggleSidebar())
      .on('@toggleAdminMenu', () => this._toggleAdminMenu())
      .on('@clickAdminMenu', event => console.log(event.detail));

    this._sidebarView //
      .setup(document.querySelector(`[data-sidebar]`))
      .on('@toggleSideMenu', event => this._toggleSideMenu(event.detail));

    this._modalView.setup(document.querySelector('main'));
    this._notificationView.setup(document.querySelector('[data-notification]'));

    this._centerInfoView
      .setup(document.querySelector(`[data-center-info]`))
      .on('@chageExtraAddress', event => this._changeExtraAddress(event.detail))
      .on('@changeCallNum', event => this._changeCallNum(event.detail))
      .on('@changePhoneCallNum', event => this._changePhoneCallNum(event.detail))
      .on('@changeIntroduce', event => this._changeIntroduce(event.detail))
      .on('@updateCenterInfo', this._updateCenterInfo);

    this._lifeCycle();
  };

  /* 메서드 */

  // 라이프 사이클
  _lifeCycle = async () => {
    /* 사이드바 메뉴 설정 */
    // * 일단 기본 정보 페이지로 들어왔다고 가정 -> 나중에는 url 값 받아서 구분해야함
    this._sidebarView.initMenu({
      depth1: 'centerInfo',
      depth2: 'baseInfo',
    });

    // 기본 정보 세팅
    const initialCenterInfo = await this._centerInfoModel.initInfo(999);
    this._centerInfoView.initItems(initialCenterInfo);
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
  _toggleSideMenu = ({ menu }) => {
    this._sidebarView.toggleSideMenu(menu);
  };

  // 센터 기본 정보 변경
  _changeExtraAddress = ({ value }) => this._centerInfoModel.changeExtraAddress(value);
  _changeCallNum = ({ number, index }) => this._centerInfoModel.changeCallNum(number, index);
  _changePhoneCallNum = ({ number, index }) => this._centerInfoModel.changePhoneCallNum(number, index);
  _changeIntroduce = ({ value }) => this._centerInfoModel.changeIntroduce(value);

  _updateCenterInfo = async () => {
    this._modalView.showLoadingModal('센터 정보 수정중입니다');

    const { isSuccess, error } = await this._centerInfoModel.update();
    console.log(tag, '센터 정보 업데이트 결과', { isSuccess, error });

    if (!isSuccess) {
      this._modalView.removeModal();
      this._notificationView.addNotification(error.sort, error.title, error.description, true);
      return;
    }

    this._modalView.removeModal();
  };
};

export default BaseInfoController;
