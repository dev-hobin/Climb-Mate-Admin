import View from '../core/View';
import { TOOL_TYPE, TOOL_EXTRA_INFO } from '../model/ToolInfoModel';

const tag = '[ToolInfoView]';

const ToolInfoView = class extends View {
  constructor() {
    super();

    this.clickable = true;
  }

  /* 인터페이스 */
  setup = element => {
    this.init(element);

    this._itemList = element.querySelector('[data-list]');
    this._items = element.querySelectorAll('[data-item]');

    this._healthTextContainer = element.querySelector('[data-health-description-container]');
    this._healthTextArea = element.querySelector('[data-health-description-textarea]');

    this._updateBtn = element.querySelector('[data-update-btn]');

    this._bindEvents();
    return this;
  };

  initItems = (itemInfoObj, extraInfoObj) => {
    // 헬스도구 추가 설명 텍스트 설정
    this._healthTextArea.value = extraInfoObj[TOOL_EXTRA_INFO.HEALTH];

    this._items.forEach(item => {
      const toolType = item.dataset.item;
      const checkbox = item.querySelector('[type=checkbox]');
      checkbox.checked = itemInfoObj[toolType];
      if (toolType === TOOL_TYPE.HEATH && checkbox.checked) this._healthTextContainer.classList.add('show');
    });
  };

  /* 메서드 */
  _bindEvents = () => {
    this._itemList.addEventListener('click', event => {
      if (!this.clickable) return;
      if (event.target.type !== 'checkbox') return;
      const checkbox = event.target;
      const toolType = event.target.closest('[data-item]').dataset.item;
      this.trigger('@checkTool', { view: this, toolType, checked: checkbox.checked });
      // 헬스도구 체크 해제했을 경우 텍스트 박스 안보이게
      if (toolType === TOOL_TYPE.HEATH) {
        if (checkbox.checked) this._healthTextContainer.classList.add('show');
        else this._healthTextContainer.classList.remove('show');
      }
    });
    this._healthTextArea.addEventListener('keyup', event => {
      if (event.target.value.length > 200) {
        event.target.value = event.target.value.substr(0, 200);
      }
      const textValue = event.target.value;
      this.trigger('@editExtraInfo', { view: this, extra: TOOL_EXTRA_INFO.HEALTH, info: textValue });
    });

    this._updateBtn.addEventListener('click', () => {
      if (!this.clickable) return;
      this.trigger('@updateTool', { view: this });
    });
  };
};

export default ToolInfoView;
