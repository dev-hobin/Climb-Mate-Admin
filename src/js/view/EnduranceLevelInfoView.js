import View from '../core/View';
import Pickr from '@simonwep/pickr';

const tag = '[EnduranceLevelInfoView]';

const EnduranceLevelInfoView = class extends View {
  constructor() {
    super();

    this._template = new Template();
  }

  /* 인터페이스 */
  setup = element => {
    this.init(element);

    this._colorPicker = Pickr.create({
      el: '[data-level-info="endurance"] [data-color-picker]',
      theme: 'nano',

      swatches: [
        'rgba(244, 67, 54, 1)',
        'rgba(233, 30, 99, 1)',
        'rgba(156, 39, 176, 1)',
        'rgba(103, 58, 183, 1)',
        'rgba(63, 81, 181, 1)',
        'rgba(33, 150, 243, 1)',
        'rgba(3, 169, 244, 1)',
        'rgba(0, 188, 212, 1)',
        'rgba(0, 150, 136, 1)',
        'rgba(76, 175, 80, 1)',
        'rgba(139, 195, 74, 1)',
        'rgba(205, 220, 57, 1)',
        'rgba(255, 235, 59, 1)',
        'rgba(255, 193, 7, 1)',
      ],

      components: {
        // Main components
        preview: true,
        opacity: false,
        hue: false,

        // Input / output Options
        interaction: {
          hex: true,
          rgba: true,
          hsla: false,
          hsva: false,
          cmyk: false,
          input: true,
          clear: false,
          save: true,
        },
      },
    });

    this._colorNameInput = element.querySelector('[data-color-name-input]');
    this._levelNameInput = element.querySelector('[data-level-name-input]');
    this._addBtn = element.querySelector('[data-add-btn]');

    this._itemList = element.querySelector('[data-item-list]');

    this._bindEvents();

    console.log(tag, 'setup()');
    return this;
  };

  initItems = (infoArray = []) => {
    if (infoArray.length === 0) return (this._itemList.innerHTML = this._template.getEmptyItemHtml());
    this._itemList.innerHTML = this._template.getItemsHtml(infoArray);
  };

  /* 메서드 */
  _bindEvents = () => {
    this._colorPicker.on('init', instance => {
      const { save: saveBtn } = instance.getRoot().interaction;
      saveBtn.value = '저장';
      saveBtn.addEventListener('click', () => instance.hide());
    });
  };
};

class Template {
  getEmptyItemHtml = () => {
    return `
        <li class="empty-level-item" data-empty-item>상품을 추가해주세요</li>
        `;
  };
  getItemsHtml = infoArray => {
    let initialHtml = '';
    return infoArray.reduce((html, item, index) => {
      const level = index + 1;
      const { color, colorName, levelName } = item;
      return (
        html +
        `
        <li class="level-item" data-item>
          <div class="level-item__level" data-item-level>Level - ${level}</div>
          <div class="level-item__color-container">
            <div class="level-item__color" style="background-color: ${color};" data-item-color></div>
            <div class="level-item__color-name" data-item-color-name>${colorName}</div>
          </div>
          <div class="level-item__level-name" data-item-level-name>${levelName}</div>
          <div class="flex-start-container level-item__btn-container" data-btn-container>
            <button class="level-item__edit-btn" data-btn="edit">
              <i class="far fa-edit level-item__edit-btn-icon"></i>
            </button>
            <button class="level-item__delete-btn" data-btn="delete">
              <i class="fas fa-trash level-item__delete-btn-icon"></i>
            </button>
          </div>
        </li>
      `
      );
    }, initialHtml);
  };
}

export default EnduranceLevelInfoView;
