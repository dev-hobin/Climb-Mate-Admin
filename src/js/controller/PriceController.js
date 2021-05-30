import HeaderView from '../view/HeaderView';
import SidebarView from '../view/SidebarView';
import ModalView from '../view/ModalView';
import NotificationView from '../view/NotificationView';

import PriceImageInfoView from '../view/PriceImageInfoView';
import NecessaryPriceInfoView from '../view/NecessaryPriceInfoView';
import ExtraPriceInfoView from '../view/ExtraPriceInfoView';

import UserModel from '../model/UserModel';

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
    this._userModel = new UserModel();

    this._singleImageUploadModel = new SingleImageUploadModel();
    this._necessaryPriceInfoModel = new NecessaryPriceInfoModel();
    this._extraPriceInfoModel = new ExtraPriceInfoModel();
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
      depth2: 'price',
    });

    // 가격표 이미지 설정
    const {
      isSuccess: isPriceImageInitSuccess,
      error: priceImageInitError,
      data: priceImageInitData,
    } = await this._singleImageUploadModel.initImage(accessToken, SINGLE_IMAGE_UPLOADER_TYPE.PRICE);
    if (!isPriceImageInitSuccess) {
      this._notificationView.addNotification(
        priceImageInitError.sort,
        priceImageInitError.title,
        priceImageInitError.description
      );
    } else {
      const { imageUrl } = priceImageInitData;
      this._priceImageInfoView.setImage(imageUrl);
    }

    // 필수 상품 정보 설정
    const {
      isSuccess: isNecessaryGoodsInitSuccess,
      error: necessaryGoodsInitError,
      data: necessaryGoodsInitData,
    } = await this._necessaryPriceInfoModel.initInfo(accessToken);
    if (!isNecessaryGoodsInitSuccess) {
      this._notificationView.addNotification(
        necessaryGoodsInitError.sort,
        necessaryGoodsInitError.title,
        necessaryGoodsInitError.description
      );
    } else {
      const { goodsInfo } = necessaryGoodsInitData;
      this._necessaryPriceInfoView.initInfo(goodsInfo);
    }

    // 추가 상품 정보 설정
    const {
      isSuccess: isExtraGoodsInitSuccess,
      error: extraGoodsInitError,
      data: extraGoodsInitData,
    } = await this._extraPriceInfoModel.initInfo(accessToken);
    if (!isExtraGoodsInitSuccess) {
      this._notificationView.addNotification(
        extraGoodsInitError.sort,
        extraGoodsInitError.title,
        extraGoodsInitError.description
      );
    } else {
      const { goodsInfo } = extraGoodsInitData;
      this._extraPriceInfoView.initInfo(goodsInfo);
    }
  };

  // 헤더 어드민 메뉴 토글
  _toggleAdminMenu = () => this._headerView.toggleAdminMenu();

  // 사이드바 토글
  _toggleSidebar = () => this._sidebarView.toggleSidebar();
  // 사이드 메뉴 토글
  _toggleSideMenu = ({ menu }) => this._sidebarView.toggleSideMenu(menu);
  // 경고 모달 보여주기
  _showAlertModal = ({ description, eventInfo }) => this._modalView.showAlertModal(description, eventInfo);

  // 로그아웃
  _logout = () => this._userModel.logout();

  // 가격표 이미지 변경
  _changePriceImage = ({ type, fileList }) => {
    this._singleImageUploadModel.changeCurrentImage(type, fileList);
    this._priceImageInfoView.setTempImage(fileList[0]);
  };
  // 가격표 이미지 변경 확인
  _confirmPriceImage = async ({ type }) => {
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
      this._modalView.removeModal();
      return this._notificationView.addNotification(error.sort, error.title, error.description, true);
    } else {
      const { imgUrl } = data;
      this._priceImageInfoView.setImage(imgUrl);
      this._modalView.removeModal();
      this._notificationView.addNotification('success', '사진 수정 완료', '성공적으로 사진을 수정했습니다', true);
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
    const [accessToken, centerId] = this._userModel.getCenterInfo();

    this._modalView.showLoadingModal('상품 정보를 수정중입니다');
    const { isSuccess, error, data } = await this._necessaryPriceInfoModel.editPrice(
      accessToken,
      centerId,
      goodsType,
      price
    );
    this._modalView.removeModal();
    if (!isSuccess) {
      const { sort, title, description } = error;
      return this._notificationView.addNotification(sort, title, description, true);
    }
    const { price: priceString } = data;
    this._necessaryPriceInfoView.setPrice(priceType, priceString);
    this._notificationView.addNotification('success', '필수 상품 정보 수정 성공', '상품 정보가 수정되었습니다', true);
  };

  // 추가 상품 정보 아이템 추가
  _addExtraItem = async ({ goodsName, goodsPrice }) => {
    const [accessToken, centerId] = this._userModel.getCenterInfo();

    this._modalView.showLoadingModal('상품을 추가중입니다');
    const { isSuccess, error, data } = await this._extraPriceInfoModel.addItem(
      accessToken,
      centerId,
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
