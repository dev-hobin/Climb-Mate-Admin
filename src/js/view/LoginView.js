import View from '../core/View';

const tag = '[LoginView]';

const LoginView = class extends View {
  constructor() {
    super();
  }

  /* 인터페이스 */
  setup = element => {
    this.init(element);

    this._idInput = element.querySelector('[data-id]');
    this._passwordInput = element.querySelector('[data-password]');
    this._loginBtn = element.querySelector('[data-login-btn]');

    this._bindEvents();

    console.log(`${tag} setup()`);
    return this;
  };

  /* 메서드 */
  _bindEvents = () => {
    this._loginBtn.addEventListener('click', () => {
      const id = this._idInput.value.trim();
      const password = this._passwordInput.value.trim();

      if (!id) return this._idInput.focus();
      if (!password) return this._passwordInput.focus();

      this.trigger('@login', { id, password });
    });
  };
};

export default LoginView;
