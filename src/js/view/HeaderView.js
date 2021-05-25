import View from '../core/View';

const tag = '[HeaderView]';

const HeaderView = class extends View {
  constructor() {
    super();
  }

  /* 인터페이스 */

  setup = element => {
    this.init(element);

    this._centerName = element.querySelector('[data-center-name]');

    this._sidebarToggleBtn = element.querySelector(`[data-sidebar-toggle-btn]`);
    this._adminMenuBtn = element.querySelector(`[data-admin-menu-btn]`);

    this._adminMenuList = element.querySelector(`[data-admin-menu-list]`);

    this._bindEvents();

    return this;
  };
  setCenterName = name => (this._centerName.textContent = name);

  toggleAdminMenu = () => {
    this._adminMenuBtn.classList.toggle('active');
  };

  /* 메서드 */

  _bindEvents = () => {
    // 사이드 메뉴 토글 버튼
    this._sidebarToggleBtn.addEventListener('click', () => this.trigger('@toggleSidebar', {}));
    // 어드민 메뉴 토글 버튼
    this._adminMenuBtn.addEventListener('click', event => {
      if (!event.target.dataset.hasOwnProperty('adminMenuBtn')) return;
      this.trigger('@toggleAdminMenu', {});
    });
    // 어드민 메뉴 리스트 클릭
    this._adminMenuList.addEventListener('click', event => {
      const menuName = event.target.dataset.adminMenu;
      if (!menuName) return;
      switch (true) {
        case menuName === 'logOut':
          this.trigger('@clickLogout');
          break;

        default:
          throw '사용할 수 있는 메뉴가 아닙니다';
      }
    });
  };
};

export default HeaderView;
