import HeaderView from '../view/HeaderView';
import SidebarView from '../view/SidebarView';
import ModalView from '../view/ModalView';
import NotificationView from '../view/NotificationView';
import FacilityInfoView from '../view/FacilityInfoView';

import FacilityUpdateModel from '../model/FacilityUpdateModel';

const tag = '[DetailInfoController]';

const DetailInfoController = class {
  constructor() {
    // 뷰
    this._headerView = new HeaderView();
    this._sidebarView = new SidebarView();
    this._modalView = new ModalView();
    this._notificationView = new NotificationView();
    this._facilityInfoView = new FacilityInfoView();

    // 모델
    this._facilityUpdateModel = new FacilityUpdateModel();
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

    this._facilityInfoView //
      .setup(document.querySelector(`[data-facilities]`))
      .on('@checkFacility', event => this._updateFacilityCheckInfo(event.detail))
      .on('@updateFacility', this._updateFacility);

    this._modalView.setup(document.querySelector('main'));
    this._notificationView.setup(document.querySelector('[data-notification]'));

    this._lifeCycle();
  };

  /* 메서드 */

  // 라이프 사이클
  _lifeCycle = async () => {
    /* 사이드바 메뉴 설정 */
    // * 일단 시설 및 가격 페이지로 들어왔다고 가정 -> 나중에는 url 값 받아서 구분해야함
    this._sidebarView.initMenu({
      depth1: 'centerInfo',
      depth2: 'detailInfo',
    });

    // 아이템 체크
    const initialFacilities = await this._facilityUpdateModel.initInfo(999);
    this._facilityInfoView.initItems(initialFacilities);
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

  _updateFacilityCheckInfo = ({ facilityType, checked }) => {
    this._facilityUpdateModel.updateCheckInfo(facilityType, checked);
  };
  _updateFacility = async () => {
    this._modalView.showLoadingModal('시설 정보 수정중입니다');

    const { isSuccess, error } = await this._facilityUpdateModel.update();
    console.log(tag, '시설 업데이트 결과', { isSuccess, error });

    if (!isSuccess) {
      this._modalView.removeModal();
      this._notificationView.addNotification(error.sort, error.title, error.description, true);
      return;
    }

    this._modalView.removeModal();
  };
};

export default DetailInfoController;
