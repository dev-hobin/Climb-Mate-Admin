import HeaderView from '../view/HeaderView';
import SidebarView from '../view/SidebarView';
import ModalView from '../view/ModalView';
import NotificationView from '../view/NotificationView';
import FacilityInfoView from '../view/FacilityInfoView';
import ToolInfoView from '../view/ToolInfoView';

import UserModel from '../model/UserModel';

import FacilityInfoModel from '../model/FacilityInfoModel';
import ToolInfoModel from '../model/ToolInfoModel';

const tag = '[DetailInfoController]';

const DetailInfoController = class {
  constructor() {
    // 뷰
    this._headerView = new HeaderView();
    this._sidebarView = new SidebarView();
    this._modalView = new ModalView();
    this._notificationView = new NotificationView();
    this._facilityInfoView = new FacilityInfoView();
    this._toolInfoView = new ToolInfoView();

    // 모델
    this._userModel = new UserModel();

    this._facilityInfoModel = new FacilityInfoModel();
    this._toolInfoModel = new ToolInfoModel();
  }

  /* 인터페이스 */

  init = () => {
    this._headerView //
      .setup(document.querySelector(`[data-header]`))
      .on('@toggleSidebar', () => this._toggleSidebar())
      .on('@toggleAdminMenu', () => this._toggleAdminMenu())
      .on('@clickLogout', () => this._logout());

    this._sidebarView //
      .setup(document.querySelector(`[data-sidebar]`))
      .on('@toggleSideMenu', event => this._toggleSideMenu(event.detail));

    this._facilityInfoView //
      .setup(document.querySelector(`[data-facilities]`))
      .on('@checkFacility', event => this._updateFacilityCheckInfo(event.detail))
      .on('@editExtraInfo', event => this._editFacilityExtraInfo(event.detail))
      .on('@updateFacility', this._updateFacility);

    this._toolInfoView //
      .setup(document.querySelector(`[data-tools]`))
      .on('@checkTool', event => this._updateToolCheckInfo(event.detail))
      .on('@editExtraInfo', event => this._editToolExtraInfo(event.detail))
      .on('@updateTool', this._updateTool);

    this._modalView.setup(document.querySelector('main'));
    this._notificationView.setup(document.querySelector('[data-notification]'));

    this._lifeCycle();
  };

  /* 메서드 */

  // 라이프 사이클
  _lifeCycle = async () => {
    // 로그인 확인
    if (!this._userModel.isLogged()) return location.replace('/login.html');
    // 사용할 액세스키
    let accessToken = this._userModel.getAccessToken();
    // 센터 이름 세팅
    const centerName = await this._userModel.getName();
    this._headerView.setCenterName(centerName);
    /* 사이드바 메뉴 설정 */
    this._sidebarView.initMenu({
      depth1: 'centerInfo',
      depth2: 'detailInfo',
    });

    // 시설 아이템 체크
    const {
      isSuccess: isFacilityInitSuccess,
      error: facilityInitError,
      data: facilityInitData,
    } = await this._facilityInfoModel.initInfo(accessToken);
    if (!isFacilityInitSuccess) {
      this._notificationView.addNotification(
        facilityInitError.sort,
        facilityInitError.title,
        facilityInitError.description
      );
    } else {
      const { checkInfo, extraInfo } = facilityInitData;
      this._facilityInfoView.initItems(checkInfo, extraInfo);
    }

    // 도구 아이템 체크
    const {
      isSuccess: isToolInitSuccess,
      error: toolInitError,
      data: toolInitData,
    } = await this._toolInfoModel.initInfo(accessToken);
    if (!isToolInitSuccess) {
      this._notificationView.addNotification(toolInitError.sort, toolInitError.title, toolInitError.description);
    } else {
      const { checkInfo, extraInfo } = toolInitData;
      this._toolInfoView.initItems(checkInfo, extraInfo);
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
  _toggleSideMenu = ({ menu }) => {
    this._sidebarView.toggleSideMenu(menu);
  };

  // 로그아웃
  _logout = () => this._userModel.logout();

  _updateFacilityCheckInfo = ({ facilityType, checked }) => {
    this._facilityInfoModel.updateCheckInfo(facilityType, checked);
  };
  _editFacilityExtraInfo = ({ extra, info }) => {
    this._facilityInfoModel.updateExtraInfo(extra, info);
  };
  _updateFacility = async () => {
    this._modalView.showLoadingModal('시설 정보 수정중입니다');

    const { isSuccess, error } = await this._facilityInfoModel.update();
    console.log(tag, '시설 업데이트 결과', { isSuccess, error });
    this._modalView.removeModal();

    if (!isSuccess) return this._notificationView.addNotification(error.sort, error.title, error.description, true);
    this._notificationView.addNotification('success', '시설 정보 수정', '성공적으로 시설 정보를 수정했습니다', true);
  };

  _updateToolCheckInfo = ({ toolType, checked }) => {
    this._toolInfoModel.updateCheckInfo(toolType, checked);
  };
  _editToolExtraInfo = ({ extra, info }) => {
    this._toolInfoModel.updateExtraInfo(extra, info);
  };
  _updateTool = async () => {
    this._modalView.showLoadingModal('도구 정보 수정중입니다');

    const { isSuccess, error } = await this._toolInfoModel.update();
    console.log(tag, '도구 업데이트 결과', { isSuccess, error });
    this._modalView.removeModal();

    if (!isSuccess) return this._notificationView.addNotification(error.sort, error.title, error.description, true);
    this._notificationView.addNotification('success', '도구 정보 수정', '성공적으로 도구 정보를 수정했습니다', true);
  };
};

export default DetailInfoController;
