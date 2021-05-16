import View from '../core/View';

const tag = '[NotificationView]';

const NotificationView = class extends View {
  constructor() {
    super();
  }

  /* 인터페이스 */

  setup = element => {
    this.init(element);
    console.log(`${tag} setup()`);
    return this;
  };

  addCautionNotification = (title, description, removeBefore = false) => {
    if (removeBefore) this._element.innerHTML = '';

    const notification = document.createElement('div');
    notification.setAttribute('class', 'notification__contents');
    notification.setAttribute('data-type', 'caution');
    notification.innerHTML = this._getCautionContentsHtml(title, description);

    // 닫기 이벤트 달아주기
    notification.querySelector('[data-close-btn]').addEventListener('click', () => notification.remove());
    this._element.append(notification);
  };
  addErrorNotification = (title, description, removeBefore = false) => {
    if (removeBefore) this._element.innerHTML = '';

    const notification = document.createElement('div');
    notification.setAttribute('class', 'notification__contents');
    notification.setAttribute('data-type', 'error');
    notification.innerHTML = this._getErrorContentsHtml(title, description);

    // 닫기 이벤트 달아주기
    notification.querySelector('[data-close-btn]').addEventListener('click', () => notification.remove());
    this._element.append(notification);
  };

  /* 메서드 */
  _getCautionContentsHtml = (title, description) => {
    return `<i class="fas fa-exclamation-triangle notification__caution-icon"></i>
    <div class="notification__message">
      <span class="notification__message-title">${title}</span>
      <span class="notification__message-description">${description}</span>
    </div>
    <button class="notification__close-btn" data-close-btn>
      <i class="fas fa-times notification__close-btn-icon"></i>
    </button>`;
  };
  _getErrorContentsHtml = (title, description) => {
    return `<i class="fas fa-exclamation-circle notification__error-icon"></i>
    <div class="notification__message">
      <span class="notification__message-title">${title}</span>
      <span class="notification__message-description">${description}</span>
    </div>
    <button class="notification__close-btn" data-close-btn>
      <i class="fas fa-times notification__close-btn-icon"></i>
    </button>`;
  };
};

export default NotificationView;
