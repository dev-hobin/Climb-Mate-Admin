import HeaderView from '../view/HeaderView';
import SidebarView from '../view/SidebarView';
import ModalView from '../view/ModalView';
import NotificationView from '../view/NotificationView';

import LevelImageInfoView from '../view/LevelImageInfoView';
import BorderingLevelInfoView from '../view/BorderingLevelInfoView';
import EnduranceLevelInfoView from '../view/EnduranceLevelInfoView';

import UserModel from '../model/UserModel';

import SingleImageUploadModel, { SINGLE_IMAGE_UPLOADER_TYPE } from '../model/SingleImageUploadModel';
import LevelInfoModel, { LEVEL_INFO_TYPE } from '../model/LevelInfoModel';

const tag = '[LevelController]';

const LevelController = class {
  constructor() {
    // 뷰
    this._headerView = new HeaderView();
    this._sidebarView = new SidebarView();
    this._modalView = new ModalView();
    this._notificationView = new NotificationView();
    this._levelImageInfoView = new LevelImageInfoView();
    this._borderingLevelInfoView = new BorderingLevelInfoView();
    this._enduranceLevelInfoView = new EnduranceLevelInfoView();

    // 모델
    this._userModel = new UserModel();

    this._singleImageUploadModel = new SingleImageUploadModel();
    this._levelInfoModel = new LevelInfoModel();
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
      .on('@toggleSideMenu', event => this._toggleSideMenu(event));

    this._modalView
      .setup(document.querySelector('main'))
      .on('@confirmLevelImageDelete', event => this._deleteLevelImage(event))
      .on('@confirmLevelInfoItemDelete', event => this._deleteLevelItem(event));

    this._notificationView.setup(document.querySelector('[data-notification]'));

    this._levelImageInfoView //
      .setup(document.querySelector('[data-level-image-info]'))
      .on('@showAlert', event => this._showAlertModal(event))
      .on('@changeImage', event => this._changeLevelImage(event))
      .on('@confirmImage', event => this._confirmLevelImage(event))
      .on('@cancelImage', event => this._cancelLevelImage(event));

    this._borderingLevelInfoView //
      .setup(document.querySelector(`[data-level-info="bordering"]`))
      .on('@addItem', event => this._addLevelItem(event))
      .on('@showAlert', event => this._showAlertModal(event))
      .on('@confirmEditItem', event => this._editLevelItem(event));

    this._enduranceLevelInfoView //
      .setup(document.querySelector(`[data-level-info="endurance"]`))
      .on('@addItem', event => this._addLevelItem(event))
      .on('@showAlert', event => this._showAlertModal(event))
      .on('@confirmEditItem', event => this._editLevelItem(event));

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
      depth2: 'level',
    });

    // 난이도 이미지 설정
    const {
      isSuccess: isLevelImageInitSuccess,
      error: levelImageInitError,
      data: levelImageInitData,
    } = await this._singleImageUploadModel.initImage(accessToken, SINGLE_IMAGE_UPLOADER_TYPE.LEVEL);
    if (!isLevelImageInitSuccess) {
      this._notificationView.addNotification(
        levelImageInitError.sort,
        levelImageInitError.title,
        levelImageInitError.description
      );
    } else {
      const { imageUrl } = levelImageInitData;
      this._levelImageInfoView.setImage(imageUrl);
    }

    // 볼더링 난이도 정보 설정
    const {
      isSuccess: isBorderingLevelInitSuccess,
      error: borderingLevelInitError,
      data: borderingLevelInitData,
    } = await this._levelInfoModel.initInfo(accessToken, LEVEL_INFO_TYPE.BORDERING);

    if (!isBorderingLevelInitSuccess) {
      this._notificationView.addNotification(
        borderingLevelInitError.sort,
        borderingLevelInitError.title,
        borderingLevelInitError.description
      );
    } else {
      const { levelInfo: borderingLevelInfo } = borderingLevelInitData;
      this._borderingLevelInfoView.initItems(borderingLevelInfo);
    }

    // 지구력 난이도 정보 설정
    const {
      isSuccess: isEnduranceLevelInitSuccess,
      error: enduranceLevelInitError,
      data: enduranceLevelInitData,
    } = await this._levelInfoModel.initInfo(accessToken, LEVEL_INFO_TYPE.ENDURANCE);

    if (!isEnduranceLevelInitSuccess) {
      this._notificationView.addNotification(
        enduranceLevelInitError.sort,
        enduranceLevelInitError.title,
        enduranceLevelInitError.description
      );
    } else {
      const { levelInfo: enduranceLevelInfo } = enduranceLevelInitData;
      this._enduranceLevelInfoView.initItems(enduranceLevelInfo);
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

  // 헤더 어드민 메뉴 토글
  _toggleAdminMenu = () => this._headerView.toggleAdminMenu();

  // 사이드바 토글
  _toggleSidebar = () => this._sidebarView.toggleSidebar();
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

  // 난이도 이미지 변경
  _changeLevelImage = event => {
    const { view } = event.detail;
    this._setClickable(view, false);

    const { type, fileList } = event.detail;
    this._singleImageUploadModel.changeCurrentImage(type, fileList);
    this._levelImageInfoView.setTempImage(fileList[0]);

    this._setClickable(view, true);
  };
  // 난이도 이미지 변경 확인
  _confirmLevelImage = async event => {
    const { view } = event.detail;
    this._setClickable(view, false);

    const { type } = event.detail;
    const [accessToken, centerId] = this._userModel.getCenterInfo();
    const centerName = await this._userModel.getName();

    this._modalView.showLoadingModal('사진을 변경중입니다');
    const { isSuccess, error, data } = await this._singleImageUploadModel.editImage(
      type,
      accessToken,
      centerId,
      centerName
    );
    if (!isSuccess) {
      this._setClickable(view, true);
      this._modalView.removeModal();
      return this._notificationView.addNotification(error.sort, error.title, error.description, true);
    } else {
      this._setClickable(view, true);
      const { imgUrl } = data;
      this._levelImageInfoView.setImage(imgUrl);
      this._modalView.removeModal();
      this._notificationView.addNotification('success', '사진 수정 완료', '성공적으로 사진을 수정했습니다', true);
    }
  };
  // 난이도 이미지 변경 취소
  _cancelLevelImage = event => {
    const { view, type } = event.detail;
    this._setClickable(view, false);

    const initialImageUrl = this._singleImageUploadModel.cancelImage(type);
    this._levelImageInfoView.setImage(initialImageUrl);

    this._setClickable(view, true);
  };
  // 난이도 이미지 삭제
  _deleteLevelImage = async event => {
    const { type } = event.detail;

    const [accessToken, centerId] = this._userModel.getCenterInfo();

    this._modalView.showLoadingModal('사진을 삭제중입니다');
    const { isSuccess, error, data } = await this._singleImageUploadModel.deleteImage(type, accessToken, centerId);
    if (!isSuccess) {
      this._modalView.removeModal();
      this._notificationView.addNotification(error.sort, error.title, error.description, true);
    } else {
      const {
        isSuccess: isLevelImageInitSuccess,
        error: levelImageInitError,
        data: levelImageInitData,
      } = await this._singleImageUploadModel.initImage(accessToken, SINGLE_IMAGE_UPLOADER_TYPE.LEVEL);
      if (!isLevelImageInitSuccess) {
        this._notificationView.addNotification(
          levelImageInitError.sort,
          levelImageInitError.title,
          levelImageInitError.description
        );
      } else {
        const { imageUrl } = levelImageInitData;
        this._levelImageInfoView.setImage(imageUrl);
      }
      this._modalView.removeModal();
      this._notificationView.addNotification('success', '사진 삭제 완료', '성공적으로 사진을 삭제했습니다', true);
    }
  };

  // 난이도 아이템 추가
  _addLevelItem = async event => {
    const { view, type, color, colorName, levelName } = event.detail;
    this._setClickable(view, false);

    const [accessToken, centerId] = this._userModel.getCenterInfo();

    this._modalView.showLoadingModal('난이도 정보 추가중입니다');
    const { isSuccess, error, data } = await this._levelInfoModel.addItem(
      accessToken,
      centerId,
      type,
      color,
      colorName,
      levelName
    );
    this._modalView.removeModal();
    if (!isSuccess) {
      this._setClickable(view, true);
      const { sort, title, description } = error;
      this._notificationView.addNotification(sort, title, description, true);
    } else {
      const { isSuccess, error, data } = await this._levelInfoModel.initInfo(accessToken, type);
      if (!isSuccess) {
        this._setClickable(view, true);
        this._notificationView.addNotification(error.sort, error.title, error.description, true);
      } else {
        const { levelInfo } = data;

        switch (true) {
          case type === LEVEL_INFO_TYPE.BORDERING:
            this._borderingLevelInfoView.initItems(levelInfo);
            break;
          case type === LEVEL_INFO_TYPE.ENDURANCE:
            this._enduranceLevelInfoView.initItems(levelInfo);
            break;
          default:
            throw '사용할 수 없는 난이도 타입입니다';
        }
        this._setClickable(view, true);
        this._notificationView.addNotification(
          'success',
          '난이도 정보 추가 성공',
          '성공적으로 난이도 정보를 추가했습니다',
          true
        );
      }
    }
  };
  _deleteLevelItem = async event => {
    const { type, color, levelName } = event.detail;

    const [accessToken, centerId] = this._userModel.getCenterInfo();

    this._modalView.showLoadingModal('난이도 아이템 삭제중입니다');
    const { isSuccess, error, data } = await this._levelInfoModel.deleteItem(
      accessToken,
      centerId,
      type,
      color,
      levelName
    );
    this._modalView.removeModal();
    if (!isSuccess) {
      const { sort, title, description } = error;
      this._notificationView.addNotification(sort, title, description, true);
    } else {
      const { isSuccess, error, data } = await this._levelInfoModel.initInfo(accessToken, type);
      if (!isSuccess) {
        this._notificationView.addNotification(error.sort, error.title, error.description, true);
      } else {
        const { levelInfo } = data;

        switch (true) {
          case type === LEVEL_INFO_TYPE.BORDERING:
            this._borderingLevelInfoView.initItems(levelInfo);
            break;
          case type === LEVEL_INFO_TYPE.ENDURANCE:
            this._enduranceLevelInfoView.initItems(levelInfo);
            break;
          default:
            throw '사용할 수 없는 난이도 타입입니다';
        }
        this._notificationView.addNotification(
          'success',
          '난이도 정보 삭제 성공',
          '성공적으로 난이도 정보를 삭제했습니다',
          true
        );
      }
    }
  };
  _editLevelItem = async event => {
    const {
      view,
      type,
      initialColor,
      initialColorName,
      initialLevelName,
      currentColor,
      currentColorName,
      currentLevelName,
    } = event.detail;
    this._setClickable(view, false);

    const [accessToken, centerId] = this._userModel.getCenterInfo();

    this._modalView.showLoadingModal('난이도 아이템 수정중입니다');
    const { isSuccess, error, data } = await this._levelInfoModel.editItem(
      accessToken,
      type,
      initialColor,
      initialColorName,
      initialLevelName,
      currentColor,
      currentColorName,
      currentLevelName
    );
    this._modalView.removeModal();
    if (!isSuccess) {
      this._setClickable(view, true);
      const { sort, title, description } = error;
      this._notificationView.addNotification(sort, title, description, true);
    } else {
      const { isSuccess, error, data } = await this._levelInfoModel.initInfo(accessToken, type);
      if (!isSuccess) {
        this._setClickable(view, true);
        this._notificationView.addNotification(error.sort, error.title, error.description, true);
      } else {
        const { levelInfo } = data;

        switch (true) {
          case type === LEVEL_INFO_TYPE.BORDERING:
            this._borderingLevelInfoView.initItems(levelInfo);
            break;
          case type === LEVEL_INFO_TYPE.ENDURANCE:
            this._enduranceLevelInfoView.initItems(levelInfo);
            break;
          default:
            throw '사용할 수 없는 난이도 타입입니다';
        }
        this._setClickable(view, true);
        this._notificationView.addNotification(
          'success',
          '난이도 정보 수정 성공',
          '성공적으로 난이도 정보를 수정했습니다',
          true
        );
      }
    }
  };
};

export default LevelController;
