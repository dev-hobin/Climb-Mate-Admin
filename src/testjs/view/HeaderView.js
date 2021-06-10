import View from '../core/View';

const tag = '[HeaderView]';

const HeaderView = class extends View {
  constructor() {
    super();

    this.clickable = true;
  }

  /* 인터페이스 */

  setup = element => {
    this.init(element);

    this._centerName = element.querySelector('[data-center-name]');
    this._sidebarToggleBtn = element.querySelector(`[data-sidebar-toggle-btn]`);

    this._bindEvents();

    return this;
  };
  setCenterName = name => (this._centerName.textContent = name);

  /* 메서드 */

  _bindEvents = () => {
    // 사이드 메뉴 토글 버튼
    this._sidebarToggleBtn.addEventListener('click', () => this.trigger('@toggleSidebar'));
  };
};

export default HeaderView;
