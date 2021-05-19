import HeaderView from '../view/HeaderView';
import SidebarView from '../view/SidebarView';
import ModalView from '../view/ModalView';
import NotificationView from '../view/NotificationView';

import PriceImageInfoView from '../view/PriceImageInfoView';

import SingleImageUploadModel, { SINGLE_IMAGE_UPLOADER_TYPE } from '../model/SingleImageUploadModel';

const tag = '[PriceController]';

const PriceController = class {
  constructor() {
    // 뷰
    this._headerView = new HeaderView();
    this._sidebarView = new SidebarView();
    this._modalView = new ModalView();
    this._notificationView = new NotificationView();
    this._priceImageInfoView = new PriceImageInfoView();

    // 모델
    this._singleImageUploadModel = new SingleImageUploadModel();
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

    this._modalView //
      .setup(document.querySelector('main'))
      .on('@confirmPriceImageDelete', event => this._deletePriceImage(event.detail));

    this._notificationView.setup(document.querySelector('[data-notification]'));

    this._priceImageInfoView //
      .setup(document.querySelector('[data-price-image-info]'))
      .on('@showAlert', event => this._showAlertModal(event.detail))
      .on('@changeImage', event => this._changePriceImage(event.detail))
      .on('@confirmImage', event => this._confirmPriceImage(event.detail))
      .on('@cancelImage', event => this._cancelPriceImage(event.detail));

    this._lifeCycle();
  };

  /* 메서드 */

  // 라이프 사이클
  _lifeCycle = async () => {
    /* 사이드바 메뉴 설정 */
    // * 일단 가격 정보 페이지로 들어왔다고 가정 -> 나중에는 url 값 받아서 구분해야함
    this._sidebarView.initMenu({
      depth1: 'centerInfo',
      depth2: 'price',
    });

    const initialPriceImage = await this._singleImageUploadModel.initImage(
      'centerId',
      SINGLE_IMAGE_UPLOADER_TYPE.PRICE
    );
    this._priceImageInfoView.setImage(initialPriceImage);
  };

  // 헤더 어드민 메뉴 토글
  _toggleAdminMenu = () => this._headerView.toggleAdminMenu();

  // 사이드바 토글
  _toggleSidebar = () => this._sidebarView.toggleSidebar();
  // 사이드 메뉴 토글
  _toggleSideMenu = ({ menu }) => this._sidebarView.toggleSideMenu(menu);
  // 경고 모달 보여주기
  _showAlertModal = ({ description, eventInfo }) => this._modalView.showAlertModal(description, eventInfo);

  // 가격표 이미지 변경
  _changePriceImage = ({ type, fileList }) => {
    this._singleImageUploadModel.changeCurrentImage(type, fileList);
    this._priceImageInfoView.setTempImage(fileList[0]);
  };
  // 가격표 이미지 변경 확인
  _confirmPriceImage = async ({ type }) => {
    // 로딩 모달 띄우기
    this._modalView.showLoadingModal('사진을 변경중입니다');
    const isSuccess = await this._singleImageUploadModel.uploadImage(type);
    if (!isSuccess) {
      this._modalView.removeModal();
      this._notificationView.addNotification('error', '사진 수정 실패', '서버 오류로 인해 사진 수정에 실패했습니다');
    } else {
      this._modalView.removeModal();
      this._notificationView.addNotification(
        'success',
        '가격표 사진 수정 성공',
        '성공적으로 가격표 사진을 수정했습니다',
        true
      );
    }
  };
  // 가격표 이미지 변경 취소
  _cancelPriceImage = ({ type }) => {
    const initialImageUrl = this._singleImageUploadModel.cancelImage(type);
    this._priceImageInfoView.setImage(initialImageUrl);
  };
  // 가격표 이미지 삭제
  _deletePriceImage = async ({ type }) => {
    // 로딩 모달 띄우기
    this._modalView.showLoadingModal('사진을 삭제중입니다');
    const isSuccess = await this._singleImageUploadModel.deleteImage(type);
    if (!isSuccess) {
      this._modalView.removeModal();
      this._notificationView.addNotification('error', '사진 삭제 실패', '서버 오류로 인해 사진 삭제에 실패했습니다');
    } else {
      this._modalView.removeModal();
      this._priceImageInfoView.setEmptyImage();
      this._notificationView.addNotification(
        'success',
        '가격표 사진 삭제 성공',
        '성공적으로 가격표 사진을 삭제했습니다',
        true
      );
    }
  };
};

export default PriceController;
