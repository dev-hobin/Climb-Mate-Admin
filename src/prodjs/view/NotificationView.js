import View from '../core/View';

const tag = '[NotificationView]';

const NotificationView = class extends View {
  constructor() {
    super();

    this.clickable = true;

    this._template = new Template();
  }

  /* 인터페이스 */

  setup = element => {
    this.init(element);
    return this;
  };

  addNotification = (sort, title, description, removeBefore = false) => {
    if (removeBefore) this._element.innerHTML = '';

    const notification = document.createElement('div');
    notification.setAttribute('class', 'notification__contents');
    notification.setAttribute('data-type', sort);

    switch (true) {
      case sort === 'success':
        notification.innerHTML = this._template.getSuccessContents(title, description);
        break;
      case sort === 'caution':
        notification.innerHTML = this._template.getCautionContents(title, description);
        break;
      case sort === 'error':
        notification.innerHTML = this._template.getErrorContents(title, description);
        break;
      default:
        notification.innerHTML = this._getErrorContentsHtml(title, description);
        break;
    }

    const timeOutRemoveId = setTimeout(() => {
      if (!notification) return;
      else return notification.remove();
    }, 3000);

    // 닫기 이벤트 달아주기
    notification.querySelector('[data-close-btn]').addEventListener('click', () => {
      notification.remove();
      clearTimeout(timeOutRemoveId);
    });

    this._element.append(notification);
  };
};

class Template {
  getSuccessContents = (title, description) => {
    return `<i class="fas fa-check-circle notification__success-icon"></i>
    <div class="notification__message">
      <span class="notification__message-title">${title}</span>
      <span class="notification__message-description">${description}</span>
    </div>
    <button class="notification__close-btn" data-close-btn>
      <i class="fas fa-times notification__close-btn-icon"></i>
    </button>`;
  };
  getCautionContents = (title, description) => {
    return `<i class="fas fa-exclamation-triangle notification__caution-icon"></i>
    <div class="notification__message">
      <span class="notification__message-title">${title}</span>
      <span class="notification__message-description">${description}</span>
    </div>
    <button class="notification__close-btn" data-close-btn>
      <i class="fas fa-times notification__close-btn-icon"></i>
    </button>`;
  };
  getErrorContents = (title, description) => {
    return `<i class="fas fa-exclamation-circle notification__error-icon"></i>
    <div class="notification__message">
      <span class="notification__message-title">${title}</span>
      <span class="notification__message-description">${description}</span>
    </div>
    <button class="notification__close-btn" data-close-btn>
      <i class="fas fa-times notification__close-btn-icon"></i>
    </button>`;
  };
}

export default NotificationView;
