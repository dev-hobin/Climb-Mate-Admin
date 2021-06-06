import HeaderView from '../view/HeaderView';
import SidebarView from '../view/SidebarView';
import ModalView from '../view/ModalView';
import NotificationView from '../view/NotificationView';
import BannerImageUploadView from '../view/BannerImageUploadView';

import UserModel from '../model/UserModel';

import ImageUploadModel, { IMAGE_UPLOADER_TYPE } from '../model/ImageUploadModel';

const tag = '[BannerController]';

const BannerController = class {
  constructor() {
    // 뷰
    this._headerView = new HeaderView();
    this._sidebarView = new SidebarView();
    this._modalView = new ModalView();
    this._notificationView = new NotificationView();
    this._bannerImageUploadView = new BannerImageUploadView();

    // 모델
    this._userModel = new UserModel();

    this._imageUploadModel = new ImageUploadModel();
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

    this._modalView.setup(document.querySelector('main')).on('@deleteItem', event => this._deleteImage(event));

    this._notificationView.setup(document.querySelector('[data-notification]'));

    this._bannerImageUploadView //
      .setup(document.querySelector(`[data-uploader="banner"]`))
      .on('@addImages', event => this._addImages(event))
      .on('@changeImageLocation', event => this._changeImageLocation(event))
      .on('@showAlert', event => this._showAlertModal(event))
      .on('@editImages', event => this._editImages(event));

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
      depth2: 'banner',
    });

    // 배너 이미지 설정
    const {
      isSuccess: isBannerInfoInitSuccess,
      error: bannerInfoInitError,
      data: bannerInfoInitData,
    } = await this._imageUploadModel.initImages(accessToken, IMAGE_UPLOADER_TYPE.BANNER);
    if (!isBannerInfoInitSuccess) {
      this._notificationView.addNotification(
        bannerInfoInitError.sort,
        bannerInfoInitError.title,
        bannerInfoInitError.description
      );
    } else {
      const { images } = bannerInfoInitData;
      this._bannerImageUploadView.initItems(images);
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

  // 로그아웃
  _logout = () => this._userModel.logout();

  // 이미지 추가
  _addImages = async event => {
    const { view, type, fileList } = event.detail;
    this._setClickable(view, false);

    const currentImages = this._imageUploadModel.getCurrentImages(type);
    // 추가한 파일들 유효성 검사하여 유효성 검사 통과한 이미지 파일들과 유효성 검사 실패한 이유가 담긴 에러 리스트 반환
    const [validatedImageFiles, errorList] = this._imageUploadModel.vaildateImageFiles(fileList, currentImages.length);
    console.group(tag, type, '이미지 유효성 검사');
    console.log('통과한 이미지들', validatedImageFiles);
    console.log('에러 내역', errorList);
    console.groupEnd();

    if (validatedImageFiles.length !== 0) {
      // 배너 이미지 추가
      this._imageUploadModel.addCurrentImages(type, validatedImageFiles);
      // 뷰에 아이템 추가 요청
      this[`_${type}ImageUploadView`].addItems(validatedImageFiles);
      console.log(tag, type, '이미지 리스트에 아이템들 추가');
    }

    if (errorList.length === 0) {
      this._setClickable(view, true);
    } else {
      for (const errorInfo of errorList) {
        const { title, description } = errorInfo;
        this._notificationView.addNotification('error', title, description);
      }
      this._setClickable(view, true);
    }
  };
  // 경고 모달 보여주기
  _showAlertModal = event => {
    const { view, description, eventInfo } = event.detail;
    this._setClickable(view, false);

    this._modalView.showAlertModal(description, eventInfo);

    this._setClickable(view, true);
  };
  // 이미지 삭제
  _deleteImage = event => {
    const { type, index } = event.detail;

    this._imageUploadModel.addDeletedImages(type, index);
    this[`_${type}ImageUploadView`].removeItem(index);
    console.log(tag, type, '이미지 삭제');
  };
  // 이미지 자리 변경
  _changeImageLocation = event => {
    const { type, beforeIndex, afterIndex } = event.detail;
    this._imageUploadModel.changeImageLocation(type, beforeIndex, afterIndex);
  };
  // 이미지 수정
  _editImages = async event => {
    const { view, type } = event.detail;
    this._setClickable(view, false);

    if (!this._imageUploadModel.isImagesChanged(type)) {
      return this._notificationView.addNotification('caution', '변경사항 없음', '수정사항이 없습니다', true);
    }
    const [accessToken, centerId] = this._userModel.getCenterInfo();
    this._modalView.showLoadingModal('사진을 수정중입니다');
    const { isSuccess, error, data } = await this._imageUploadModel.editImages(accessToken, centerId, type);
    console.log({ isSuccess, error, data });
    if (!isSuccess) {
      this._setClickable(view, true);
      this._modalView.removeModal();
      this._notificationView.addNotification(error.sort, error.title, error.description, true);
    } else {
      const {
        isSuccess: isBannerInfoInitSuccess,
        error: bannerInfoInitError,
        data: bannerInfoInitData,
      } = await this._imageUploadModel.initImages(accessToken, type);
      if (!isBannerInfoInitSuccess) {
        this._setClickable(view, true);
        this._modalView.removeModal();
        this._notificationView.addNotification(
          bannerInfoInitError.sort,
          bannerInfoInitError.title,
          bannerInfoInitError.description
        );
      } else {
        const { images } = bannerInfoInitData;
        this._bannerImageUploadView.initItems(images);
        this._setClickable(view, true);
        this._modalView.removeModal();
        this._notificationView.addNotification('success', '사진 수정 완료', '성공적으로 사진을 수정했습니다', true);
      }
    }
  };
};

export default BannerController;
