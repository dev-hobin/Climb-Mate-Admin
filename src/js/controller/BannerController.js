import HeaderView from '../view/HeaderView';
import SidebarView from '../view/SidebarView';
import ModalView from '../view/ModalView';
import NotificationView from '../view/NotificationView';
import BannerImageUploadView from '../view/BannerImageUploadView.js';

import ImageUploadModel, { IMAGE_UPLOADER_TYPE } from '../model/ImageUploadModel.js';

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
    this._imageUploadModel = new ImageUploadModel();
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

    this._modalView.setup(document.querySelector('main')).on('@deleteItem', event => this._deleteImage(event.detail));

    this._notificationView.setup(document.querySelector('[data-notification]'));

    this._bannerImageUploadView //
      .setup(document.querySelector(`[data-uploader="banner"]`))
      .on('@addBannerImages', event => this._addImages(event.detail))
      .on('@changeImageLocation', event => this._changeImageLocation(event.detail))
      .on('@showAlert', event => this._showAlertModal(event.detail))
      .on('@uploadImages', event => this._uploadImages(event.detail));

    this._lifeCycle();
  };

  /* 메서드 */

  // 라이프 사이클
  _lifeCycle = async () => {
    /* 사이드바 메뉴 설정 */
    // * 일단 배너 사진 페이지로 들어왔다고 가정 -> 나중에는 url 값 받아서 구분해야함
    this._sidebarView.initMenu({
      depth1: 'centerInfo',
      depth2: 'banner',
    });

    /* 배너 이미지 설정 */
    const initialBannerImages = await this._imageUploadModel.initImages('centerId', IMAGE_UPLOADER_TYPE.BANNER);
    this._bannerImageUploadView.initItems(initialBannerImages);
    console.log(tag, '배너 initial 이미지 추가');
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

  // 이미지 추가
  _addImages = async ({ type, fileList }) => {
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

    if (errorList.length === 0) return;
    for (const errorInfo of errorList) {
      const { title, description } = errorInfo;
      this._notificationView.addNotification('error', title, description);
    }
  };
  // 경고 모달 보여주기
  _showAlertModal = ({ description, eventInfo }) => {
    this._modalView.showAlertModal(description, eventInfo);
  };
  // 이미지 삭제
  _deleteImage = ({ type, index }) => {
    this._imageUploadModel.addDeletedImages(type, index);
    this[`_${type}ImageUploadView`].removeItem(index);
    console.log(tag, type, '이미지 삭제');
  };
  // 이미지 자리 변경
  _changeImageLocation = ({ type, beforeIndex, afterIndex }) => {
    this._imageUploadModel.changeImageLocation(type, beforeIndex, afterIndex);
  };
  // 이미지 업로드
  _uploadImages = async ({ type }) => {
    if (!this._imageUploadModel.isImagesChanged(type))
      return this._notificationView.addNotification('caution', '변경사항 없음', '수정할 사진이 없습니다');
    // 로딩 모달 띄우기
    this._modalView.showLoadingModal('사진을 수정중입니다');

    // 사진 업로드 결과 받기
    const isSuccess = await this._imageUploadModel.uploadImages(type);
    if (isSuccess) {
      console.log(tag, type, `이미지 업로드 결과 : ${isSuccess}`);
      this._modalView.removeModal();
    } else {
      console.log(tag, type, `이미지 업로드 결과 : ${isSuccess}`);
      this._notificationView.addNotification(
        'error',
        '이미지 업로드 실패',
        '서버 오류로 인해 이미지 업로드에 실패했습니다'
      );
    }
  };
};

export default BannerController;
