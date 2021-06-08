import View from '../core/View';

const tag = '[LoginView]';

const LoginView = class extends View {
  constructor() {
    super();

    this.clickable = true;
  }

  /* 인터페이스 */
  setup = element => {
    this.init(element);

    this._idInput = element.querySelector('[data-id]');
    this._passwordInput = element.querySelector('[data-password]');
    this._loginBtn = element.querySelector('[data-login-btn]');

    this._bindEvents();

    return this;
  };

  /* 메서드 */
  _bindEvents = () => {
    this._loginBtn.addEventListener('click', () => {
      if (!this.clickable) return;

      const id = this._idInput.value.trim();
      const password = this._passwordInput.value.trim();

      if (!id) return this._idInput.focus();
      if (!password) return this._passwordInput.focus();

      this.trigger('@login', { view: this, id, password });
    });
    this._idInput.addEventListener('keyup', event => {
      if (event.keyCode === 13) {
        if (!this.clickable) return;

        const id = this._idInput.value.trim();
        const password = this._passwordInput.value.trim();

        if (!id) return this._idInput.focus();
        if (!password) return this._passwordInput.focus();

        this.trigger('@login', { view: this, id, password });
      } else {
        if (event.target.value.trim().length <= 50) {
          return;
        } else {
          event.target.value = event.target.value.substr(0, 50);
          return false;
        }
      }
    });
    this._passwordInput.addEventListener('keyup', event => {
      if (event.keyCode === 13) {
        if (!this.clickable) return;

        const id = this._idInput.value.trim();
        const password = this._passwordInput.value.trim();

        if (!id) return this._idInput.focus();
        if (!password) return this._passwordInput.focus();

        this.trigger('@login', { view: this, id, password });
      } else {
        if (event.target.value.trim().length <= 16) {
          return;
        } else {
          event.target.value = event.target.value.substr(0, 16);
        }
      }
    });
  };
};

export default LoginView;
