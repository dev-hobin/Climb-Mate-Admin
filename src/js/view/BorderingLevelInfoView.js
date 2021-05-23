import View from '../core/View';
import Pickr from '@simonwep/pickr';

import { LEVEL_INFO_TYPE } from '../model/LevelInfoModel';

const tag = '[BorderingLevelInfoView]';

const BorderingLevelInfoView = class extends View {
  constructor() {
    super();

    this._template = new Template();
  }

  /* 인터페이스 */
  setup = element => {
    this.init(element);

    this._colorPicker = Pickr.create({
      el: '[data-level-info="bordering"] [data-color-picker]',
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

  addItem = (color, colorName, levelName) => {
    const emptyItem = this._itemList.querySelector('[data-empty-item]');
    if (emptyItem) emptyItem.remove();

    const level = this._itemList.childElementCount + 1;

    const item = document.createElement('li');
    item.setAttribute('class', 'level-item');
    item.setAttribute('data-item', '');

    const itemHtml = this._template.getItemHtml(level, color, colorName, levelName);
    item.innerHTML = itemHtml;

    this._itemList.append(item);
  };
  updateItemList = (itemList = []) => {
    if (itemList.length === 0) return (this._itemList.innerHTML = this._template.getEmptyItemHtml());
    this._itemList.innerHTML = this._template.getItemsHtml(itemList);
  };

  /* 메서드 */
  _bindEvents = () => {
    this._colorPicker.on('init', instance => {
      const { save: saveBtn } = instance.getRoot().interaction;
      saveBtn.value = '저장';
      saveBtn.addEventListener('click', () => instance.hide());
    });

    this._itemList.addEventListener('click', event => {
      const btnType = event.target.dataset.btn;
      if (!btnType) return;
      const item = event.target.closest('[data-item]');
      const colorContainer = item.querySelector('[data-color-container]');
      const levelNameContainer = item.querySelector('[data-level-name-container]');
      const btnContainer = item.querySelector('[data-btn-container]');

      let initialColor;
      let initialLevelName;

      switch (true) {
        case btnType === 'delete':
          initialColor = colorContainer.querySelector('[data-item-color]').dataset.itemColor;
          initialLevelName = levelNameContainer.querySelector('[data-level-name]').textContent;
          this.trigger('@showAlert', {
            description: '정말로 삭제하시겠습니까?',
            eventInfo: {
              eventName: 'level-info__delete-item',
              type: LEVEL_INFO_TYPE.BORDERING,
              color: initialColor,
              levelName: initialLevelName,
            },
          });
          break;

        default:
          throw `${tag} 사용 불가능한 버튼 타입입니다`;
      }
    });

    this._addBtn.addEventListener('click', () => {
      const color = this._colorPicker.getSelectedColor().toHEXA().toString();
      const colorName = this._colorNameInput.value.trim();
      const levelName = this._levelNameInput.value.trim();

      if (!colorName) return this._colorNameInput.focus();
      if (!levelName) return this._levelNameInput.focus();

      this.trigger('@addItem', { type: LEVEL_INFO_TYPE.BORDERING, color, colorName, levelName });
    });
  };
};

class Template {
  getEmptyItemHtml = () => {
    return `
        <li class="empty-level-item" data-empty-item>상품을 추가해주세요</li>
        `;
  };
  getItemHtml = (level, color, colorName, levelName) => {
    return `
      <div class="level-item__level" data-item-level>Level - ${level}</div>
        <div class="level-item__color-container" data-color-container>
        <div class="level-item__color" style="background-color: ${color};" data-item-color="${color}"></div>
        <div class="level-item__color-name" data-item-color-name>${colorName}</div>
      </div>
      <div class="level-item__level-name-container" data-level-name-container>
        <div class="level-item__level-name" data-level-name>${levelName}</div>
      </div>
      <div class="flex-start-container level-item__btn-container" data-btn-container>
        <button class="level-item__edit-btn" data-btn="edit">
          <i class="far fa-edit level-item__edit-btn-icon"></i>
        </button>
        <button class="level-item__delete-btn" data-btn="delete">
          <i class="fas fa-trash level-item__delete-btn-icon"></i>
        </button>
      </div>
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
          <div class="level-item__color-container" data-color-container>
            <div class="level-item__color" style="background-color: ${color};" data-item-color="${color}"></div>
            <div class="level-item__color-name" data-item-color-name>${colorName}</div>
          </div>
          <div class="level-item__level-name-container" data-level-name-container>
            <div class="level-item__level-name" data-level-name>${levelName}</div>
          </div>
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

export default BorderingLevelInfoView;
