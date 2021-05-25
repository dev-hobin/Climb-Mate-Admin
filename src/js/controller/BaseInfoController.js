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
      .on('@toggleSidebar', () => this._toggleSidebar())
      .on('@toggleAdminMenu', () => this._toggleAdminMenu())
      .on('@clickLogout', () => this._logout());

    this._sidebarView //
      .setup(document.querySelector(`[data-sidebar]`))
      .on('@toggleSideMenu', event => this._toggleSideMenu(event.detail));

    this._modalView.setup(document.querySelector('main'));
    this._notificationView.setup(document.querySelector('[data-notification]'));

    this._baseCenterInfoView //
      .setup(document.querySelector(`[data-center-info]`))
      .on('@chageExtraAddress', event => this._changeExtraAddress(event.detail))
      .on('@changeCallNum', event => this._changeCallNum(event.detail))
      .on('@changePhoneCallNum', event => this._changePhoneCallNum(event.detail))
      .on('@changeIntroduce', event => this._changeIntroduce(event.detail))
      .on('@updateCenterInfo', this._updateCenterInfo);

    this._baseSettingInfoView //
      .setup(document.querySelector('[data-setting-info]'))
      .on('@changeSettingRatio', event => this._changeSettingRatio(event.detail))
      .on('@changeSettingCycle', event => this._changeSettingCycle(event.detail))
      .on('@chageNextSettingDate', event => this._chageNextSettingDate(event.detail))
      .on('@chageRecentSettingDate', event => this._chageRecentSettingDate(event.detail))
      .on('@updateSettingInfo', this._updateSettingInfo);

    this._baseWorkingTimeInfoView //
      .setup(document.querySelector('[data-working-time-info]'))
      .on('@changeWeekdayTime', event => this._changeWeekdayTime(event.detail))
      .on('@changeWeekendTime', event => this._changeWeekendTime(event.detail))
      .on('@changeHolidayTime', event => this._changeHolidayTime(event.detail))
      .on('@changeNoticeTime', event => this._changeNoticeTime(event.detail))
      .on('@updateWorkingTimeInfo', this._updateWorkingTimeInfo);

    this._baseSocialInfoView //
      .setup(document.querySelector('[data-social-info]'))
      .on('@checkSocial', event => this._checkSocial(event.detail))
      .on('@changeSocialUrl', event => this._changeSocialUrl(event.detail))
      .on('@updateSocialInfo', this._updateSocialInfo);

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

    const [initialSocialCheckInfo, initialSocialUrlInfo] = await this._baseSocialInfoModel.initInfo(accessToken);
    this._baseSocialInfoView.initItems(initialSocialCheckInfo, initialSocialUrlInfo);
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

  // 센터 기본 정보 변경
  _changeExtraAddress = ({ value }) => this._baseCenterInfoModel.changeExtraAddress(value);
  _changeCallNum = ({ number, index }) => this._baseCenterInfoModel.changeCallNum(number, index);
  _changePhoneCallNum = ({ number, index }) => this._baseCenterInfoModel.changePhoneCallNum(number, index);
  _changeIntroduce = ({ value }) => this._baseCenterInfoModel.changeIntroduce(value);

  _updateCenterInfo = async () => {
    this._modalView.showLoadingModal('센터 정보 수정중입니다');

    const { isSuccess, error } = await this._baseCenterInfoModel.update();
    console.log(tag, '센터 정보 업데이트 결과', { isSuccess, error });
    this._modalView.removeModal();

    if (!isSuccess) return this._notificationView.addNotification(error.sort, error.title, error.description, true);
    return this._notificationView.addNotification(
      'success',
      '센터 정보 수정',
      '센터 정보가 정상적으로 수정되었습니다',
      true
    );
  };

  // 센터 세팅 정보 변경
  _changeSettingRatio = ({ bordering, endurance }) =>
    this._baseSettingInfoModel.changeSettingRatio(bordering, endurance);
  _changeSettingCycle = ({ value }) => this._baseSettingInfoModel.changeSettingCycle(value);
  _chageNextSettingDate = ({ value }) => this._baseSettingInfoModel.chageNextSettingDate(value);
  _chageRecentSettingDate = ({ value }) => this._baseSettingInfoModel.chageRecentSettingDate(value);

  _updateSettingInfo = async () => {
    this._modalView.showLoadingModal('세팅 정보 수정중입니다');

    const { isSuccess, error } = await this._baseSettingInfoModel.update();
    console.log(tag, '세팅 정보 업데이트 결과', { isSuccess, error });
    this._modalView.removeModal();
    if (!isSuccess) return this._notificationView.addNotification(error.sort, error.title, error.description, true);
    this._notificationView.addNotification('success', '세팅 정보 수정', '성공적으로 세팅 정보를 수정했습니다', true);
  };

  // 운영시간 정보 변경
  _changeWeekdayTime = ({ value }) => this._baseWorkingTimeInfoModel.changeWeekdayTime(value);
  _changeWeekendTime = ({ value }) => this._baseWorkingTimeInfoModel.changeWeekendTime(value);
  _changeHolidayTime = ({ value }) => this._baseWorkingTimeInfoModel.changeHolidayTime(value);
  _changeNoticeTime = ({ value }) => this._baseWorkingTimeInfoModel.changeNoticeTime(value);

  _updateWorkingTimeInfo = async () => {
    this._modalView.showLoadingModal('운영시간 정보 수정중입니다');

    const { isSuccess, error } = await this._baseWorkingTimeInfoModel.update();
    console.log(tag, '운영시간 정보 업데이트 결과', { isSuccess, error });
    this._modalView.removeModal();
    if (!isSuccess) return this._notificationView.addNotification(error.sort, error.title, error.description, true);
    this._notificationView.addNotification(
      'success',
      '운영시간 정보 수정',
      '성공적으로 운영시간 정보를 수정했습니다',
      true
    );
  };

  // 소셜 정보 변경
  _checkSocial = ({ socialType, overCount }) => {
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
  _changeSocialUrl = ({ socialType, url }) => {
    this._baseSocialInfoModel.changeSocialUrl(socialType, url);
  };
  _updateSocialInfo = async () => {
    this._modalView.showLoadingModal('소셜 정보를 수정중입니다');

    const { isSuccess, error } = await this._baseSocialInfoModel.update();
    console.log(tag, '소셜 정보 업데이트 결과', { isSuccess, error });
    this._modalView.removeModal();
    if (!isSuccess) return this._notificationView.addNotification(error.sort, error.title, error.description, true);
    this._notificationView.addNotification('success', '소셜 정보 수정', '성공적으로 소셜 정보를 수정했습니다', true);
  };
};

export default BaseInfoController;
