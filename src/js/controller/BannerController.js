import HeaderView from '../view/HeaderView';
import SidebarView from '../view/SidebarView';
import ModalView from '../view/ModalView';
import NotificationView from '../view/NotificationView';
import BannerImageUploadView from '../view/BannerImageUploadView.js';

import ImageUploadModel from '../model/ImageUploadModel.js';

const tag = '[BannerController]';

const BannerController = class {
  constructor() {
    // 배너 이미지 데이터
    this._initialBannerImageArray = [];
    this._bannerImageArray = [];
    this._deletedImageArray = [];

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

    this._modalView
      .setup(document.querySelector('main'))
      .on('@deleteBannerItem', event => this._deleteImage(event.detail));

    this._notificationView.setup(document.querySelector('[data-notification]'));

    this._bannerImageUploadView //
      .setup(document.querySelector(`[data-uploader="banner"]`))
      .on('@addImages', event => this._addImages(event.detail))
      .on('@changeImageLocation', event => this._changeImageLocation(event.detail))
      .on('@showAlert', event => this._showAlertModal(event.detail))
      .on('@uploadImages', () => this._uploadImages());

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
    // 1. 이미 등록되어 있는 이미지 url 요청
    const currentBannerUrls = await this._imageUploadModel.getBannerImages();
    console.log('이미 등록되어있는 사진 정보 가져오기');
    // 2. 컨트롤러 배너 이미지 리스트 업데이트
    this._initialBannerImageArray.push(...currentBannerUrls);
    this._bannerImageArray.push(...currentBannerUrls);
    // 3. 뷰에 이미지 아이템 리스트 초기화
    this._bannerImageUploadView.initItems(currentBannerUrls);
    console.log('이미지 리스트에 아이템 설정');
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
  _addImages = async ({ fileList }) => {
    // 추가한 파일들 유효성 검사하여 유효성 검사 통과한 이미지 파일들과 유효성 검사 실패한 이유가 담긴 에러 리스트 반환
    const [validatedImageFiles, errorList] = this._imageUploadModel.vaildateImageFiles(
      fileList,
      this._bannerImageArray.length
    );
    console.log('이미지 유효성 검사 통과한 것들만 가져온다');

    if (validatedImageFiles.length !== 0) {
      // 현재 이미지 배열 업데이트
      this._bannerImageArray.push(...validatedImageFiles);
      // 뷰에 아이템 추가 요청
      this._bannerImageUploadView.addItems(validatedImageFiles);
      console.log('이미지 리스트에 아이템들 추가');
    }

    if (errorList.length === 0) return;
    for (const errorInfo of errorList) {
      const { title, description } = errorInfo;
      this._notificationView.addErrorNotification(title, description);
    }
  };
  // 경고 모달 보여주기
  _showAlertModal = ({ description, eventInfo }) => {
    this._modalView.showAlertModal(description, eventInfo);
  };
  // 배너 이미지 삭제
  _deleteImage = ({ index }) => {
    // 현재 이미지 배열 업데이트하고 삭제될 이미지 따로 모은다
    const deletedImages = this._bannerImageArray.splice(index, 1);
    // 삭제될 이미지 리스트 업데이트
    this._deletedImageArray.push(...deletedImages);
    // 업데이트 완료 됐으면 뷰에게 아이템 삭제하라고 요청한다
    this._bannerImageUploadView.removeItem(index);
    // 이미지 삭제 alert 삭제
    this._modalView.removeModal();
    console.log('이미지 삭제');
  };
  // 이미지 자리 변경
  _changeImageLocation = ({ beforeIndex, afterIndex }) => {
    // 원래 배열에서 드래그한 이미지 빼고 인덱스 앞으로 당긴다
    const draggedItemArray = this._bannerImageArray.splice(beforeIndex, 1);
    // 자리 이동한 인덱스에 아이템 추가후 다른것들 뒤로 민다
    this._bannerImageArray.splice(afterIndex, 0, ...draggedItemArray);

    console.log('자리 변경 전');
    console.log(this._bannerImageArray);
    console.log('자리 변경 후');
    console.log(this._bannerImageArray);
  };
  // 이미지 업로드
  _uploadImages = async () => {
    if (!this._checkImagesChange(this._initialBannerImageArray, this._bannerImageArray))
      return this._notificationView.addCautionNotification('변경사항 없음', '수정할 사진이 없습니다');
    // 로딩 모달 띄우기
    this._modalView.showLoadingModal('사진을 수정중입니다');
    console.log('이미지 업로드 진행');
    const orderedList = this._bannerImageArray.map((image, index) => {
      if (typeof image === 'object') return { order: index + 1, file: image };
      else return { order: index + 1, url: image };
    });
    console.log('순서 정보 추가');
    console.log(orderedList);

    const files = orderedList.filter(imageObj => imageObj.hasOwnProperty('file'));
    const urls = orderedList.filter(imageObj => imageObj.hasOwnProperty('url'));
    const willDeleted = this._deletedImageArray.filter(image => typeof image === 'string');

    console.log('업로드할 파일만 뽑아낸 정보');
    console.log(files);
    console.log('이미 등록된 url만 뽑아낸 정보');
    console.log(urls);
    console.log('삭제할 이미지');
    console.log(willDeleted);

    // 사진 업로드 결과 받기
    const isSuccess = await this._imageUploadModel.uploadImages([]);
    if (isSuccess) {
      console.log(`${tag} 업로드 결과 : ${isSuccess}`);
      this._modalView.removeModal();
      console.log(`${tag} 사진 수정 완료 후 페이지 reload`);
    } else {
      console.log(`${tag} 업로드 결과 : ${isSuccess}`);
      // todo : 에러 모달 만들어야함
      console.log('이미지 업로드 실패');
    }
  };
  // 이미지들을 수정했는지 안했는지 확인
  _checkImagesChange = (initialImages, currentImages) => {
    // 1. 배열 길이 비교 -> 다르면 무조건 달라진 것
    if (initialImages.length !== currentImages.length) return true;
    // 2. 하나 하나 비교
    for (const [index, image] of currentImages.entries()) {
      if (initialImages[index] === image) continue;
      else return true;
    }
    return false;
  };
};

export default BannerController;
