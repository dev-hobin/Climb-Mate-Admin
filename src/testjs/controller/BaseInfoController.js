import HeaderView from '../view/HeaderView';
import SidebarView from '../view/SidebarView';
import ModalView from '../view/ModalView';
import NotificationView from '../view/NotificationView';

import BaseCenterInfoView from '../view/BaseCenterInfoView';
import BaseSettingInfoView from '../view/BaseSettingInfoView';
import BaseWorkingTimeInfoView from '../view/BaseWorkingTimeInfoView';
import BaseSocialInfoView from '../view/BaseSocialInfoView';

import UserModel from '../model/UserModel';

import BaseCenterInfoModel from '../model/BaseCenterInfoModel';
import BaseSettingInfoModel from '../model/BaseSettingInfoModel';
import BaseWorkingTimeInfoModel from '../model/BaseWorkingTimeInfoModel';
import BaseSocialInfoModel from '../model/BaseSocialInfoModel';

const tag = '[BaseInfoController]';

const BaseInfoController = class {
  constructor() {
    // 뷰
    this._headerView = new HeaderView();
    this._sidebarView = new SidebarView();
    this._modalView = new ModalView();
    this._notificationView = new NotificationView();

    this._baseCenterInfoView = new BaseCenterInfoView();
    this._baseSettingInfoView = new BaseSettingInfoView();
    this._baseWorkingTimeInfoView = new BaseWorkingTimeInfoView();
    this._baseSocialInfoView = new BaseSocialInfoView();

    // 모델
    this._userModel = new UserModel();

    this._baseCenterInfoModel = new BaseCenterInfoModel();
    this._baseSettingInfoModel = new BaseSettingInfoModel();
    this._baseWorkingTimeInfoModel = new BaseWorkingTimeInfoModel();
    this._baseSocialInfoModel = new BaseSocialInfoModel();
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

    this._modalView //
      .setup(document.querySelector('main'))
      .on('@logout', event => this._logout());

    this._notificationView.setup(document.querySelector('[data-notification]'));

    this._baseCenterInfoView //
      .setup(document.querySelector(`[data-center-info]`))
      .on('@chageExtraAddress', event => this._changeExtraAddress(event))
      .on('@changeCallNum', event => this._changeCallNum(event))
      .on('@changePhoneCallNum', event => this._changePhoneCallNum(event))
      .on('@changeIntroduce', event => this._changeIntroduce(event))
      .on('@updateCenterInfo', event => this._updateCenterInfo(event));

    this._baseSettingInfoView //
      .setup(document.querySelector('[data-setting-info]'))
      .on('@changeSettingRatio', event => this._changeSettingRatio(event))
      .on('@changeSettingRatioDescription', event => this._changeSettingRatioDescription(event))
      .on('@changeSettingCycle', event => this._changeSettingCycle(event))
      .on('@chageNextSettingDate', event => this._chageNextSettingDate(event))
      .on('@chageRecentSettingDate', event => this._chageRecentSettingDate(event))
      .on('@updateSettingInfo', event => this._updateSettingInfo(event));

    this._baseWorkingTimeInfoView //
      .setup(document.querySelector('[data-working-time-info]'))
      .on('@changeWeekdayTime', event => this._changeWeekdayTime(event))
      .on('@changeWeekendTime', event => this._changeWeekendTime(event))
      .on('@changeHolidayTime', event => this._changeHolidayTime(event))
      .on('@changeNoticeTime', event => this._changeNoticeTime(event))
      .on('@updateWorkingTimeInfo', event => this._updateWorkingTimeInfo(event));

    this._baseSocialInfoView //
      .setup(document.querySelector('[data-social-info]'))
      .on('@checkSocial', event => this._checkSocial(event))
      .on('@changeSocialUrl', event => this._changeSocialUrl(event))
      .on('@updateSocialInfo', event => this._updateSocialInfo(event));

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
      depth2: 'baseInfo',
    });

    // 기본 정보 세팅
    const {
      isSuccess: isCenterInfoInitSuccess,
      error: centerInfoInitError,
      data: centerInfoInitData,
    } = await this._baseCenterInfoModel.initInfo(accessToken);
    if (!isCenterInfoInitSuccess) {
      this._notificationView.addNotification(
        centerInfoInitError.sort,
        centerInfoInitError.title,
        centerInfoInitError.description
      );
    } else {
      const { centerInfo } = centerInfoInitData;
      this._baseCenterInfoView.initItems(centerInfo);
    }

    // 세팅 정보 세팅
    const {
      isSuccess: isSettingInfoInitSuccess,
      error: settingInfoInitError,
      data: settingInfoInitData,
    } = await this._baseSettingInfoModel.initInfo(accessToken);
    if (!isSettingInfoInitSuccess) {
      this._notificationView.addNotification(
        settingInfoInitError.sort,
        settingInfoInitError.title,
        settingInfoInitError.description
      );
    } else {
      const { settingInfo } = settingInfoInitData;
      this._baseSettingInfoView.initItems(settingInfo);
    }

    // 운영시간 정보 세팅
    const {
      isSuccess: isWoringTimeInfoInitSuccess,
      error: workingTimeInfoInitError,
      data: workingTimeInfoInitData,
    } = await this._baseWorkingTimeInfoModel.initInfo(accessToken);
    if (!isWoringTimeInfoInitSuccess) {
      this._notificationView.addNotification(
        workingTimeInfoInitError.sort,
        workingTimeInfoInitError.title,
        workingTimeInfoInitError.description
      );
    } else {
      const { workingTimeInfo } = workingTimeInfoInitData;
      this._baseWorkingTimeInfoView.initItems(workingTimeInfo);
    }

    // 소셜 정보 세팅
    const {
      isSuccess: isSocialInfoInitSuccess,
      error: socialInfoInitError,
      data: socialInfoInitData,
    } = await this._baseSocialInfoModel.initInfo(accessToken);
    if (!isSocialInfoInitSuccess) {
      this._notificationView.addNotification(
        socialInfoInitError.sort,
        socialInfoInitError.title,
        socialInfoInitError.description
      );
    } else {
      const { checkInfo: socialCheckInfo, urlInfo: socialUrlInfo } = socialInfoInitData;
      this._baseSocialInfoView.initItems(socialCheckInfo, socialUrlInfo);
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
    const { view } = event.detail;
    this._setClickable(view, false);

    const { description, eventInfo } = event.detail;
    this._modalView.showAlertModal(description, eventInfo);

    this._setClickable(view, true);
  };

  // 로그아웃
  _logout = () => this._userModel.logout();

  // 센터 기본 정보 변경
  _changeExtraAddress = event => {
    const { value } = event.detail;
    this._baseCenterInfoModel.changeExtraAddress(value);
  };
  _changeCallNum = event => {
    const { number, index } = event.detail;
    this._baseCenterInfoModel.changeCallNum(number, index);
  };
  _changePhoneCallNum = event => {
    const { number, index } = event.detail;
    this._baseCenterInfoModel.changePhoneCallNum(number, index);
  };
  _changeIntroduce = event => {
    const { value } = event.detail;
    this._baseCenterInfoModel.changeIntroduce(value);
  };

  _updateCenterInfo = async event => {
    const { view } = event.detail;
    this._setClickable(view, false);

    const [accessToken, centerId] = this._userModel.getCenterInfo();
    this._modalView.showLoadingModal('센터 정보 수정중입니다');
    const { isSuccess, error, data } = await this._baseCenterInfoModel.update(accessToken, centerId);
    this._modalView.removeModal();

    if (!isSuccess) {
      this._setClickable(view, true);
      this._notificationView.addNotification(error.sort, error.title, error.description, true);
    } else {
      this._setClickable(view, true);
      this._notificationView.addNotification(
        'success',
        '센터 정보 수정',
        '센터 정보가 정상적으로 수정되었습니다',
        true
      );
    }
  };

  // 센터 세팅 정보 변경
  _changeSettingRatio = event => {
    const { bordering, endurance } = event.detail;
    this._baseSettingInfoModel.changeSettingRatio(bordering, endurance);
  };
  _changeSettingRatioDescription = event => {
    const { value } = event.detail;
    this._baseSettingInfoModel.changeSettingRatioDescription(value);
  };
  _changeSettingCycle = event => {
    const { value } = event.detail;
    this._baseSettingInfoModel.changeSettingCycle(value);
  };
  _chageNextSettingDate = event => {
    const { value } = event.detail;
    this._baseSettingInfoModel.chageNextSettingDate(value);
  };
  _chageRecentSettingDate = event => {
    const { value } = event.detail;
    this._baseSettingInfoModel.chageRecentSettingDate(value);
  };

  _updateSettingInfo = async event => {
    const { view } = event.detail;
    this._setClickable(view, false);

    const [accessToken, centerId] = this._userModel.getCenterInfo();
    this._modalView.showLoadingModal('세팅 정보 수정중입니다');
    const { isSuccess, error, data } = await this._baseSettingInfoModel.update(accessToken, centerId);
    this._modalView.removeModal();

    if (!isSuccess) {
      this._setClickable(view, true);
      this._notificationView.addNotification(error.sort, error.title, error.description, true);
    } else {
      this._setClickable(view, true);
      this._notificationView.addNotification('success', '세팅 정보 수정', '성공적으로 세팅 정보를 수정했습니다', true);
    }
  };

  // 운영시간 정보 변경
  _changeWeekdayTime = event => {
    const { value } = event.detail;
    this._baseWorkingTimeInfoModel.changeWeekdayTime(value);
  };
  _changeWeekendTime = event => {
    const { value } = event.detail;
    this._baseWorkingTimeInfoModel.changeWeekendTime(value);
  };
  _changeHolidayTime = event => {
    const { value } = event.detail;
    this._baseWorkingTimeInfoModel.changeHolidayTime(value);
  };
  _changeNoticeTime = event => {
    const { value } = event.detail;
    this._baseWorkingTimeInfoModel.changeNoticeTime(value);
  };

  _updateWorkingTimeInfo = async event => {
    const { view } = event.detail;
    this._setClickable(view, false);

    const [accessToken, centerId] = this._userModel.getCenterInfo();

    this._modalView.showLoadingModal('운영시간 정보 수정중입니다');
    const { isSuccess, error, data } = await this._baseWorkingTimeInfoModel.update(accessToken, centerId);
    this._modalView.removeModal();

    if (!isSuccess) {
      this._setClickable(view, true);
      this._notificationView.addNotification(error.sort, error.title, error.description, true);
    } else {
      this._setClickable(view, true);
      this._notificationView.addNotification(
        'success',
        '운영시간 정보 수정',
        '성공적으로 운영시간 정보를 수정했습니다',
        true
      );
    }
  };

  // 소셜 정보 변경
  _checkSocial = event => {
    const { socialType, overCount } = event.detail;

    if (overCount) {
      this._notificationView.addNotification(
        'caution',
        '소셜 아이템 선택 실패',
        '소셜 아이템은 2개까지 선택 가능합니다'
      );
    } else {
      this._baseSocialInfoModel.checkSocial(socialType);
    }
  };
  _changeSocialUrl = event => {
    const { socialType, url } = event.detail;
    this._baseSocialInfoModel.changeSocialUrl(socialType, url);
  };
  _updateSocialInfo = async event => {
    const { view } = event.detail;
    this._setClickable(view, false);

    const [accessToken, centerId] = this._userModel.getCenterInfo();

    this._modalView.showLoadingModal('소셜 정보를 수정중입니다');
    const { isSuccess, error, data } = await this._baseSocialInfoModel.update(accessToken, centerId);
    this._modalView.removeModal();

    if (!isSuccess) {
      this._setClickable(view, true);
      this._notificationView.addNotification(error.sort, error.title, error.description, true);
    } else {
      this._setClickable(view, true);
      this._notificationView.addNotification('success', '소셜 정보 수정', '성공적으로 소셜 정보를 수정했습니다', true);
    }
  };
};

export default BaseInfoController;
