import HeaderView from '../view/HeaderView';
import SidebarView from '../view/SidebarView';
import ModalView from '../view/ModalView';
import NotificationView from '../view/NotificationView';

import LevelImageInfoView from '../view/LevelImageInfoView';

import SingleImageUploadModel, { SINGLE_IMAGE_UPLOADER_TYPE } from '../model/SingleImageUploadModel';

const tag = '[LevelController]';

const LevelController = class {
  constructor() {
    // 뷰
    this._headerView = new HeaderView();
    this._sidebarView = new SidebarView();
    this._modalView = new ModalView();
    this._notificationView = new NotificationView();
    this._levelImageInfoView = new LevelImageInfoView();

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

    this._modalView
      .setup(document.querySelector('main'))
      .on('@confirmLevelImageDelete', event => this._deleteLevelImage(event.detail));

    this._notificationView.setup(document.querySelector('[data-notification]'));

    this._levelImageInfoView //
      .setup(document.querySelector('[data-level-image-info]'))
      .on('@showAlert', event => this._showAlertModal(event.detail))
      .on('@changeImage', event => this._changeLevelImage(event.detail))
      .on('@confirmImage', event => this._confirmLevelImage(event.detail))
      .on('@cancelImage', event => this._cancelLevelImage(event.detail));

    this._lifeCycle();
  };

  /* 메서드 */

  // 라이프 사이클
  _lifeCycle = async () => {
    /* 사이드바 메뉴 설정 */
    // * 일단 가격 정보 페이지로 들어왔다고 가정 -> 나중에는 url 값 받아서 구분해야함
    this._sidebarView.initMenu({
      depth1: 'centerInfo',
      depth2: 'level',
    });

    const initialLevelImage = await this._singleImageUploadModel.initImage(
      'centerId',
      SINGLE_IMAGE_UPLOADER_TYPE.LEVEL
    );
    this._levelImageInfoView.setImage(initialLevelImage);
  };

  // 헤더 어드민 메뉴 토글
  _toggleAdminMenu = () => this._headerView.toggleAdminMenu();

  // 사이드바 토글
  _toggleSidebar = () => this._sidebarView.toggleSidebar();
  // 사이드 메뉴 토글
  _toggleSideMenu = ({ menu }) => this._sidebarView.toggleSideMenu(menu);
  // 경고 모달 보여주기
  _showAlertModal = ({ description, eventInfo }) => this._modalView.showAlertModal(description, eventInfo);

  // 난이도 이미지 변경
  _changeLevelImage = ({ type, fileList }) => {
    this._singleImageUploadModel.changeCurrentImage(type, fileList);
    this._levelImageInfoView.setTempImage(fileList[0]);
  };
  // 난이도 이미지 변경 확인
  _confirmLevelImage = async ({ type }) => {
    // 로딩 모달 띄우기
    this._modalView.showLoadingModal('사진을 변경중입니다');
    const isSuccess = await this._singleImageUploadModel.uploadImage(type);
    if (!isSuccess) {
      this._notificationView.addNotification('error', '사진 변경 실패', '서버 오류로 인해 사진 변경에 실패했습니다');
      this._modalView.removeModal();
    } else {
      this._modalView.removeModal();
      this._notificationView.addNotification('error', '난이도 사진 수정 성공', '성공적으로 난이도 사진을 수정헀습니다');
    }
  };
  // 난이도 이미지 변경 취소
  _cancelLevelImage = ({ type }) => {
    const initialImageUrl = this._singleImageUploadModel.cancelImage(type);
    this._levelImageInfoView.setImage(initialImageUrl);
  };
  // 난이도 이미지 삭제
  _deleteLevelImage = async ({ type }) => {
    // 로딩 모달 띄우기
    this._modalView.showLoadingModal('사진을 삭제중입니다');
    const isSuccess = await this._singleImageUploadModel.deleteImage(type);
    if (!isSuccess) {
      this._modalView.removeModal();
      this._notificationView.addNotification('error', '사진 삭제 실패', '서버 오류로 인해 사진 삭제에 실패했습니다');
    } else {
      this._levelImageInfoView.setEmptyImage();
      this._modalView.removeModal();
      this._notificationView.addNotification('success', '사진 삭제 성공', '성공적으로 사진을 삭제했습니다', true);
    }
  };
};

export default LevelController;
