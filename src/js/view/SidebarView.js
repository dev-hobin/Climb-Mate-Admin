import View from '../core/View';

const tag = '[SidebarView]';

const SidebarView = class extends View {
  constructor() {
    super();
  }

  /* 인터페이스 */
  setup = element => {
    this.init(element);

    this.menuList = element.querySelector(`[data-menu-list]`);

    this._bindEvents();

    console.log(`${tag} setup()`);
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

  // 메소드

  _bindEvents = () => {
    // 사이드바 메뉴 리스트 토글
    this.menuList.addEventListener('click', event => {
      if (event.target.tagName !== 'BUTTON') return;
      const listItem = event.target.parentElement;
      const toggleMenuName = listItem.dataset.toggleMenu;
      this.trigger('@toggleSideMenu', { menu: toggleMenuName });
    });
  };
};

export default SidebarView;
