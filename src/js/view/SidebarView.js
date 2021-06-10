import View from '../core/View';

const tag = '[SidebarView]';

const SidebarView = class extends View {
  constructor() {
    super();

    this.clickable = true;
  }

  /* 인터페이스 */
  setup = element => {
    this.init(element);

    this._detailLink = element.querySelector(`[data-detail-link]`);
    this._menuList = element.querySelector(`[data-menu-list]`);
    this._logoutBtn = element.querySelector(`[data-logout-btn]`);

    this._bindEvents();

    return this;
  };

  // 사이드바 토글
  toggleSidebar = () => {
    this._element.classList.toggle('hide');
    document.querySelector('main').classList.toggle('hide');
  };
  // 사이드 메뉴 토글
  toggleSideMenu = menuName => {
    const menuItem = this._element.querySelector(`[data-toggle-menu="${menuName}"]`);
    menuItem.classList.toggle('active');
  };
  // 사이드 메뉴 설정
  initMenu = ({ depth1: parent, depth2: child }) => {
    if (parent) this._element.querySelector(`[data-toggle-menu="${parent}"]`).classList.add('active');
    if (child) this._element.querySelector(`[data-menu="${child}"]`).classList.add('active');
  };
  // 디테일 페이지 링크 설정
  initDetailLink = id => {
    this._detailLink.setAttribute('href', `/detail?id=${id}`);
  };

  // 메소드

  _bindEvents = () => {
    // 사이드바 메뉴 리스트 토글
    this._menuList.addEventListener('click', event => {
      if (!this.clickable) return;
      if (event.target.tagName !== 'BUTTON') return;
      const listItem = event.target.parentElement;
      if (listItem.dataset.menu === 'logout') return;

      const toggleMenuName = listItem.dataset.toggleMenu;
      this.trigger('@toggleSideMenu', { menu: toggleMenuName });
    });
    // 로그아웃
    this._logoutBtn.addEventListener('click', () => {
      this.trigger('@showAlert', {
        view: this,
        description: '정말로 로그아웃 하시겠습니까??',
        eventInfo: {
          eventName: 'sidebar__logout',
        },
      });
    });
  };
};

export default SidebarView;
