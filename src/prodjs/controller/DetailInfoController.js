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
      .on('@toggleSidebar', () => this._toggleSidebar());

    this._sidebarView //
      .setup(document.querySelector(`[data-sidebar]`))
      .on('@toggleSideMenu', event => this._toggleSideMenu(event))
      .on('@showAlert', event => this._showAlertModal(event));

    this._facilityInfoView //
      .setup(document.querySelector(`[data-facilities]`))
      .on('@checkFacility', event => this._changeFacilityCheckInfo(event))
      .on('@editExtraInfo', event => this._editFacilityExtraInfo(event))
      .on('@updateFacility', event => this._updateFacility(event));

    this._toolInfoView //
      .setup(document.querySelector(`[data-tools]`))
      .on('@checkTool', event => this._changeToolCheckInfo(event))
      .on('@editExtraInfo', event => this._editToolExtraInfo(event))
      .on('@updateTool', event => this._updateTool(event));

    this._modalView //
      .setup(document.querySelector('main'))
      .on('@logout', event => this._logout());

    this._notificationView.setup(document.querySelector('[data-notification]'));

    this._lifeCycle();
  };

  /* 메서드 */

  // 라이프 사이클
  _lifeCycle = async () => {
    // 로그인 확인
    if (!this._userModel.isLogged()) return location.replace('/admin/login');
    const [accessToken, centerId] = this._userModel.getCenterInfo();
    // 센터 이름 세팅
    const centerName = await this._userModel.getName();
    this._headerView.setCenterName(centerName);
    /* 사이드바 메뉴 설정 */
    this._sidebarView.initDetailLink(centerId);
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

  // 중복 클릭 방지
  _setClickable = (view, clickable) => {
    if (clickable) {
      view.clickable = true;
    } else {
      view.clickable = false;
    }
  };

  // 사이드바 토글
  _toggleSidebar = () => this._sidebarView.toggleSidebar();
  // 사이드 메뉴 토글
  _toggleSideMenu = event => {
    const { menu } = event.detail;
    this._sidebarView.toggleSideMenu(menu);
  };

  // 로그아웃
  _logout = () => this._userModel.logout();

  // 경고 모달 보여주기
  _showAlertModal = event => {
    const { view } = event.detail;
    this._setClickable(view, false);

    const { description, eventInfo } = event.detail;
    this._modalView.showAlertModal(description, eventInfo);

    this._setClickable(view, true);
  };

  _changeFacilityCheckInfo = event => {
    const { facilityType, checked } = event.detail;
    this._facilityInfoModel.updateCheckInfo(facilityType, checked);
  };
  _editFacilityExtraInfo = event => {
    const { extra, info } = event.detail;
    this._facilityInfoModel.updateExtraInfo(extra, info);
  };
  _updateFacility = async event => {
    const { view } = event.detail;
    this._setClickable(view, false);

    const [accessToken, centerId] = this._userModel.getCenterInfo();
    this._modalView.showLoadingModal('시설 정보 수정중입니다');
    const { isSuccess, error, data } = await this._facilityInfoModel.update(accessToken, centerId);
    this._modalView.removeModal();

    if (!isSuccess) {
      this._setClickable(view, true);
      this._notificationView.addNotification(error.sort, error.title, error.description, true);
    } else {
      this._setClickable(view, true);
      this._notificationView.addNotification('success', '시설 정보 수정', '성공적으로 시설 정보를 수정했습니다', true);
    }
  };

  _changeToolCheckInfo = event => {
    const { toolType, checked } = event.detail;
    this._toolInfoModel.updateCheckInfo(toolType, checked);
  };
  _editToolExtraInfo = event => {
    const { extra, info } = event.detail;
    this._toolInfoModel.updateExtraInfo(extra, info);
  };
  _updateTool = async event => {
    const { view } = event.detail;
    this._setClickable(view, false);

    const [accessToken, centerId] = this._userModel.getCenterInfo();
    this._modalView.showLoadingModal('도구 정보 수정중입니다');
    const { isSuccess, error, data } = await this._toolInfoModel.update(accessToken, centerId);
    this._modalView.removeModal();

    if (!isSuccess) {
      this._setClickable(view, true);
      this._notificationView.addNotification(error.sort, error.title, error.description, true);
    } else {
      this._setClickable(view, true);
      this._notificationView.addNotification('success', '도구 정보 수정', '성공적으로 도구 정보를 수정했습니다', true);
    }
  };
};

export default DetailInfoController;
