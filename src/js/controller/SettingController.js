import HeaderView from '../view/HeaderView';
import SidebarView from '../view/SidebarView';
import ModalView from '../view/ModalView';
import NotificationView from '../view/NotificationView';
import BorderingImageUploadView from '../view/BorderingImageUploadView.js';
import EnduranceImageUploadView from '../view/EnduranceImageUploadView.js';

import ImageUploadModel from '../model/ImageUploadModel.js';

const tag = '[SettingController]';

const SettingController = class {
  constructor() {
    // 볼더링 이미지 데이터
    this._initialBorderingImageArray = [];
    this._borderingImageArray = [];
    this._deletedBorderingImageArray = [];
    // 지구력 이미지 데이터
    this._initialEnduranceImageArray = [];
    this._enduranceImageArray = [];
    this._deletedEnduranceImageArray = [];

    // 뷰
    this._headerView = new HeaderView();
    this._sidebarView = new SidebarView();
    this._modalView = new ModalView();
    this._notificationView = new NotificationView();
    this._borderingImageUploadView = new BorderingImageUploadView();
    this._enduranceImageUploadView = new EnduranceImageUploadView();

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
      .on('@deleteBorderingItem', event => this._deleteBorderingImage(event.detail))
      .on('@deleteEnduranceItem', event => this._deleteEnduranceImage(event.detail));

    this._notificationView.setup(document.querySelector('[data-notification]'));

    this._borderingImageUploadView //
      .setup(document.querySelector(`[data-uploader="bordering"]`))
      .on('@addBorderingImages', event => this._addBorderingImages(event.detail))
      .on('@changeBorderingImageLocation', event => this._changeBorderingImageLocation(event.detail))
      .on('@showAlert', event => this._showAlertModal(event.detail))
      .on('@uploadBorderingImages', () => this._uploadBorderingImages());

    this._enduranceImageUploadView //
      .setup(document.querySelector(`[data-uploader="endurance"]`))
      .on('@addEnduranceImages', event => this._addEnduranceImages(event.detail))
      .on('@changeEnduranceImageLocation', event => this._changeEnduranceImageLocation(event.detail))
      .on('@showAlert', event => this._showAlertModal(event.detail))
      .on('@uploadEnduranceImages', () => this._uploadEnduranceImages());

    this._lifeCycle();
  };

  /* 메서드 */

  // 라이프 사이클
  _lifeCycle = async () => {
    /* 사이드바 메뉴 설정 */
    // * 일단 세팅 사진 페이지로 들어왔다고 가정 -> 나중에는 url 값 받아서 구분해야함
    this._sidebarView.initMenu({
      depth1: 'centerInfo',
      depth2: 'setting',
    });

    /* 볼더링 이미지 설정 */
    // 1. 이미 등록되어 있는 이미지 url 요청
    const currentBorderingUrls = await this._imageUploadModel.getBoreringImages();
    console.log('이미 등록되어있는 볼더링 사진 정보 가져오기');
    // 2. 컨트롤러 볼더링 이미지 리스트 업데이트
    this._initialBorderingImageArray.push(...currentBorderingUrls);
    this._borderingImageArray.push(...currentBorderingUrls);
    // 3. 뷰에 이미지 아이템 리스트 초기화
    this._borderingImageUploadView.initItems(currentBorderingUrls);
    console.log('볼더링 이미지 리스트에 아이템 설정');

    /* 지구력 이미지 설정 */
    // 1. 이미 등록되어 있는 이미지 url 요청
    const currentEnduranceUrls = await this._imageUploadModel.getEnduranceImages();
    console.log('이미 등록되어있는 지구력 사진 정보 가져오기');
    // 2. 컨트롤러 볼더링 이미지 리스트 업데이트
    this._initialEnduranceImageArray.push(...currentEnduranceUrls);
    this._enduranceImageArray.push(...currentEnduranceUrls);
    // 3. 뷰에 이미지 아이템 리스트 초기화
    this._enduranceImageUploadView.initItems(currentEnduranceUrls);
    console.log('지구력 이미지 리스트에 아이템 설정');
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

  // 볼더링 이미지 추가
  _addBorderingImages = async ({ fileList }) => {
    // 추가한 파일들 유효성 검사하여 유효성 검사 통과한 이미지 파일들과 유효성 검사 실패한 이유가 담긴 에러 리스트 반환
    const [validatedImageFiles, errorList] = this._imageUploadModel.vaildateImageFiles(
      fileList,
      this._borderingImageArray.length
    );
    console.log('이미지 유효성 검사 통과한 것들만 가져온다');

    if (validatedImageFiles.length !== 0) {
      // 현재 이미지 배열 업데이트
      this._borderingImageArray.push(...validatedImageFiles);
      // 뷰에 아이템 추가 요청
      this._borderingImageUploadView.addItems(validatedImageFiles);
      console.log('이미지 리스트에 아이템들 추가');
    }

    if (errorList.length === 0) return;
    for (const errorInfo of errorList) {
      const { title, description } = errorInfo;
      this._notificationView.addErrorNotification(title, description);
    }
  };
  // 지구력 이미지 추가
  _addEnduranceImages = async ({ fileList }) => {
    // 추가한 파일들 유효성 검사하여 유효성 검사 통과한 이미지 파일들과 유효성 검사 실패한 이유가 담긴 에러 리스트 반환
    const [validatedImageFiles, errorList] = this._imageUploadModel.vaildateImageFiles(
      fileList,
      this._enduranceImageArray.length
    );
    console.log('이미지 유효성 검사 통과한 것들만 가져온다');

    if (validatedImageFiles.length !== 0) {
      // 현재 이미지 배열 업데이트
      this._enduranceImageArray.push(...validatedImageFiles);
      // 뷰에 아이템 추가 요청
      this._enduranceImageUploadView.addItems(validatedImageFiles);
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
  // 볼더링 이미지 삭제
  _deleteBorderingImage = ({ index }) => {
    // 현재 이미지 배열 업데이트하고 삭제될 이미지 따로 모은다
    const deletedImages = this._borderingImageArray.splice(index, 1);
    // 삭제될 이미지 리스트 업데이트
    this._deletedBorderingImageArray.push(...deletedImages);
    // 업데이트 완료 됐으면 뷰에게 아이템 삭제하라고 요청한다
    this._borderingImageUploadView.removeItem(index);
    // 이미지 삭제 alert 삭제
    this._modalView.removeModal();
    console.log('볼더링 이미지 삭제');
  };
  _deleteEnduranceImage = ({ index }) => {
    // 현재 이미지 배열 업데이트하고 삭제될 이미지 따로 모은다
    const deletedImages = this._enduranceImageArray.splice(index, 1);
    // 삭제될 이미지 리스트 업데이트
    this._deletedEnduranceImageArray.push(...deletedImages);
    // 업데이트 완료 됐으면 뷰에게 아이템 삭제하라고 요청한다
    this._enduranceImageUploadView.removeItem(index);
    // 이미지 삭제 alert 삭제
    this._modalView.removeModal();
    console.log('지구력 이미지 삭제');
  };
  // 볼더링 이미지 자리 변경
  _changeBorderingImageLocation = ({ beforeIndex, afterIndex }) => {
    // 원래 배열에서 드래그한 이미지 빼고 인덱스 앞으로 당긴다
    const draggedItemArray = this._borderingImageArray.splice(beforeIndex, 1);
    // 자리 이동한 인덱스에 아이템 추가후 다른것들 뒤로 민다
    this._borderingImageArray.splice(afterIndex, 0, ...draggedItemArray);

    console.log('자리 변경 전');
    console.log(this._borderingImageArray);
    console.log('자리 변경 후');
    console.log(this._borderingImageArray);
  };
  // 지구력 이미지 자리 변경
  _changeEnduranceImageLocation = ({ beforeIndex, afterIndex }) => {
    // 원래 배열에서 드래그한 이미지 빼고 인덱스 앞으로 당긴다
    const draggedItemArray = this._enduranceImageArray.splice(beforeIndex, 1);
    // 자리 이동한 인덱스에 아이템 추가후 다른것들 뒤로 민다
    this._enduranceImageArray.splice(afterIndex, 0, ...draggedItemArray);

    console.log('자리 변경 전');
    console.log(this._enduranceImageArray);
    console.log('자리 변경 후');
    console.log(this._enduranceImageArray);
  };
  // 볼더링 이미지 업로드
  _uploadBorderingImages = async () => {
    if (!this._checkImagesChange(this._initialBorderingImageArray, this._borderingImageArray))
      return this._notificationView.addCautionNotification('변경사항 없음', '수정할 사진이 없습니다');
    // 로딩 모달 띄우기
    this._modalView.showLoadingModal('볼더링 사진을 수정중입니다');
    console.log('이미지 업로드 진행');
    const orderedList = this._borderingImageArray.map((image, index) => {
      if (typeof image === 'object') return { order: index + 1, file: image };
      else return { order: index + 1, url: image };
    });
    console.log('순서 정보 추가');
    console.log(orderedList);

    const files = orderedList.filter(imageObj => imageObj.hasOwnProperty('file'));
    const urls = orderedList.filter(imageObj => imageObj.hasOwnProperty('url'));
    const willDeleted = this._deletedBorderingImageArray.filter(image => typeof image === 'string');

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
      console.log(`${tag} 사진 수정 완료 후 배열 업데이트`);
    } else {
      console.log(`${tag} 업로드 결과 : ${isSuccess}`);
      this._notificationView.addErrorNotification(
        '이미지 업로드 실패',
        '서버 오류로 인해 이미지 업로드에 실패했습니다'
      );
    }
  };
  // 지구력 이미지 업로드
  _uploadEnduranceImages = async () => {
    if (!this._checkImagesChange(this._initialEnduranceImageArray, this._enduranceImageArray))
      return this._notificationView.addCautionNotification('변경사항 없음', '수정할 사진이 없습니다');
    // 로딩 모달 띄우기
    this._modalView.showLoadingModal('지구력 사진을 수정중입니다');
    console.log('이미지 업로드 진행');
    const orderedList = this._enduranceImageArray.map((image, index) => {
      if (typeof image === 'object') return { order: index + 1, file: image };
      else return { order: index + 1, url: image };
    });
    console.log('순서 정보 추가');
    console.log(orderedList);

    const files = orderedList.filter(imageObj => imageObj.hasOwnProperty('file'));
    const urls = orderedList.filter(imageObj => imageObj.hasOwnProperty('url'));
    const willDeleted = this._deletedEnduranceImageArray.filter(image => typeof image === 'string');

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
      console.log(`${tag} 사진 수정 완료 후 배열 업데이트`);
    } else {
      console.log(`${tag} 업로드 결과 : ${isSuccess}`);
      this._notificationView.addErrorNotification(
        '이미지 업로드 실패',
        '서버 오류로 인해 이미지 업로드에 실패했습니다'
      );
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

export default SettingController;
