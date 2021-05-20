import HeaderView from '../view/HeaderView';
import SidebarView from '../view/SidebarView';
import ModalView from '../view/ModalView';
import NotificationView from '../view/NotificationView';

import PriceImageInfoView from '../view/PriceImageInfoView';
import NecessaryPriceInfoView from '../view/NecessaryPriceInfoView';
import ExtraPriceInfoView from '../view/ExtraPriceInfoView';

import SingleImageUploadModel, { SINGLE_IMAGE_UPLOADER_TYPE } from '../model/SingleImageUploadModel';
import NecessaryPriceInfoModel from '../model/NecessaryPriceInfoModel';
import ExtraPriceInfoModel from '../model/ExtraPriceInfoModel';

const tag = '[PriceController]';

const PriceController = class {
  constructor() {
    // 뷰
    this._headerView = new HeaderView();
    this._sidebarView = new SidebarView();
    this._modalView = new ModalView();
    this._notificationView = new NotificationView();

    this._priceImageInfoView = new PriceImageInfoView();
    this._necessaryPriceInfoView = new NecessaryPriceInfoView();
    this._extraPriceInfoView = new ExtraPriceInfoView();

    // 모델
    this._singleImageUploadModel = new SingleImageUploadModel();
    this._necessaryPriceInfoModel = new NecessaryPriceInfoModel();
    this._extraPriceInfoModel = new ExtraPriceInfoModel();
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
      .on('@confirmPriceImageDelete', event => this._deletePriceImage(event.detail))
      .on('@confirmExtraPriceItemDelete', event => this._deleteExtraItem(event.detail));

    this._notificationView.setup(document.querySelector('[data-notification]'));

    this._priceImageInfoView //
      .setup(document.querySelector('[data-price-image-info]'))
      .on('@showAlert', event => this._showAlertModal(event.detail))
      .on('@changeImage', event => this._changePriceImage(event.detail))
      .on('@confirmImage', event => this._confirmPriceImage(event.detail))
      .on('@cancelImage', event => this._cancelPriceImage(event.detail));

    this._necessaryPriceInfoView //
      .setup(document.querySelector('[data-necessary-price-info]'))
      .on('@confirmPriceEdit', event => this._editNecessaryPrice(event.detail));

    this._extraPriceInfoView //
      .setup(document.querySelector('[data-extra-price-info]'))
      .on('@addItem', event => this._addExtraItem(event.detail))
      .on('@confirmEditItem', event => this._editItem(event.detail))
      .on('@showAlert', event => this._showAlertModal(event.detail));

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

    const initialNecessaryPriceInfo = await this._necessaryPriceInfoModel.initInfo('centerId');
    this._necessaryPriceInfoView.initInfo(initialNecessaryPriceInfo);

    const initialExtraPriceInfo = await this._extraPriceInfoModel.initInfo('centerId');
    this._extraPriceInfoView.initInfo(initialExtraPriceInfo);
    console.log(initialExtraPriceInfo);
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

  // 필수 상품 정보 수정
  _editNecessaryPrice = async ({ goodsType, priceType, price }) => {
    this._modalView.showLoadingModal('상품 정보를 수정중입니다');
    const { isSuccess, error, data } = await this._necessaryPriceInfoModel.editPrice(goodsType, priceType, price);
    this._modalView.removeModal();
    if (!isSuccess) {
      const { sort, title, description } = error;
      return this._notificationView.addNotification(sort, title, description);
    }
    const { price: priceString } = data;
    this._necessaryPriceInfoView.setPrice(priceType, priceString);
    this._notificationView.addNotification('success', '필수 상품 정보 수정 성공', '상품 정보가 수정되었습니다', true);
  };

  // 추가 상품 정보 아이템 추가
  _addExtraItem = async ({ goodsName, goodsPrice }) => {
    this._modalView.showLoadingModal('상품을 추가중입니다');
    const { isSuccess, error, data } = await this._extraPriceInfoModel.addItem(
      'centerId',
      'accessKey',
      goodsName,
      goodsPrice
    );
    this._modalView.removeModal();
    if (!isSuccess) {
      const { sort, title, description } = error;
      return this._notificationView.addNotification(sort, title, description, true);
    }
    const { goodsName: name, goodsPrice: price } = data;
    this._extraPriceInfoView.addItem(name, price);
    this._notificationView.addNotification('success', '상품 정보 추가 성공', '성공적으로 상품을 추가했습니다', true);
  };
  // 추가 상품 정보 삭제
  _deleteExtraItem = async ({ goodsName }) => {
    this._modalView.showLoadingModal('상품을 삭제중입니다');
    const { isSuccess, error, data } = await this._extraPriceInfoModel.deleteItem('centerId', 'accessKey', goodsName);
    this._modalView.removeModal();
    if (!isSuccess) {
      const { sort, title, description } = error;
      return this._notificationView.addNotification(sort, title, description, true);
    }
    const { goodsName: name } = data;
    this._extraPriceInfoView.deleteItem(name);
    this._notificationView.addNotification('success', '상품 정보 삭제 성공', '성공적으로 상품을 삭제했습니다', true);
  };
  // 추가 상품 정보 수정
  _editItem = async ({ initialGoodsName, edittedGoodsName, edittedPrice }) => {
    this._modalView.showLoadingModal('상품을 수정중입니다');
    const { isSuccess, error, data } = await this._extraPriceInfoModel.editItem(
      'accessKey',
      initialGoodsName,
      edittedGoodsName,
      edittedPrice
    );
    this._modalView.removeModal();
    if (!isSuccess) {
      const { sort, title, description } = error;
      return this._notificationView.addNotification(sort, title, description, true);
    }
    const { initialGoodsName: initialName, edittedGoodsName: edittedName, edittedPrice: edittedPriceString } = data;
    this._extraPriceInfoView.editItem(initialName, edittedName, edittedPriceString);
    this._notificationView.addNotification('success', '상품 정보 수정 성공', '성공적으로 상품을 수정했습니다', true);
  };
};

export default PriceController;
