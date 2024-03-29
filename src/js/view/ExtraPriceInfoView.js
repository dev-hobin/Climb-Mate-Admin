import View from '../core/View';
const tag = '[ExtraPriceInfoView]';

const ExtraPriceInfoView = class extends View {
  constructor() {
    super();

    this.clickable = true;

    this._template = new Template();
  }

  /* 인터페이스 */
  setup = element => {
    this.init(element);

    this._nameInput = element.querySelector('[data-add-input="name"]');
    this._priceInput = element.querySelector('[data-add-input="price"]');
    this._addBtn = element.querySelector('[data-add-btn]');

    this._itemList = element.querySelector('[data-item-list]');

    this._bindEvents();

    return this;
  };
  initInfo = (infoArray = []) => {
    if (infoArray.length === 0) return (this._itemList.innerHTML = this._template.getEmptyItemHtml());
    this._itemList.innerHTML = this._template.getItemsHtml(infoArray);
  };
  addItem = (goodsName, goodsPrice) => {
    if (this._itemList.querySelector('[data-empty-item]')) this._itemList.querySelector('[data-empty-item]').remove();

    const item = document.createElement('li');
    item.setAttribute('class', 'extra-price-item');
    item.setAttribute('data-item', '');

    const itemHtml = this._template.getItemHtml(goodsName, goodsPrice);
    item.innerHTML = itemHtml;

    this._itemList.append(item);
  };
  deleteItem = goodsName => {
    const item = Array.from(this._itemList.querySelectorAll('[data-item]')).filter(
      item => item.querySelector('[data-goods-name]').textContent === goodsName
    )[0];
    item.remove();
    if (this._itemList.childElementCount === 0) this._itemList.innerHTML = this._template.getEmptyItemHtml();
  };
  editItem = (goodsInitialName, goodsEdittedName, goodsEdittedPrice) => {
    const nameInput = this._itemList.querySelector(`[data-initial-name="${goodsInitialName}"]`);
    const item = nameInput.closest('[data-item]');
    const itemHtml = this._template.getItemHtml(goodsEdittedName, goodsEdittedPrice);

    item.innerHTML = itemHtml;
  };

  /* 메소드 */
  _bindEvents = () => {
    this._nameInput.addEventListener('input', event => {
      const nameInput = event.target;
      if (nameInput.value.length > 50) nameInput.value = nameInput.value.substr(0, 50);
    });

    this._priceInput.addEventListener('input', event => {
      const priceInput = event.target;
      // 숫자만 입력
      priceInput.value = priceInput.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');
      // 9번째 자리수를 넘어갈 수 없음
      if (priceInput.value.length > 9) priceInput.value = priceInput.value.substr(0, 9);
      // 둘째자리 이상일때 맨앞에 0 제거
      if (priceInput.value.length > 1) priceInput.value = priceInput.value.replace(/(^0+)/, '');
    });

    this._addBtn.addEventListener('click', () => {
      if (!this.clickable) return;

      const goodsName = this._nameInput.value.trim();
      const goodsPrice = this._priceInput.value;

      if (goodsName.length === 0) return this._nameInput.focus();
      if (goodsPrice.length === 0 || goodsPrice == 0) return this._priceInput.focus();

      this.trigger('@addItem', { view: this, goodsName, goodsPrice });
    });

    this._itemList.addEventListener('click', event => {
      if (!this.clickable) return;

      const btnType = event.target.dataset.btn;
      if (!btnType) return;
      const item = event.target.closest('[data-item]');
      const goodsNameContainer = item.querySelector('[data-goods-name-container]');
      const priceContainer = item.querySelector('[data-price-container]');
      const btnContainer = item.querySelector('[data-btn-container]');

      let initialGoodsName;
      let edittedGoodsName;
      let initialPriceString;
      let edittedPrice;
      switch (true) {
        case btnType === 'edit':
          initialGoodsName = goodsNameContainer.querySelector('[data-goods-name]').textContent;
          goodsNameContainer.innerHTML = this._template.getEditStateNameInputHtml(initialGoodsName);

          initialPriceString = priceContainer.querySelector('[data-price]').textContent;
          priceContainer.innerHTML = this._template.getEditStatePriceInputHtml(initialPriceString);

          btnContainer.innerHTML = this._template.getEditStateBtnsHtml();
          break;
        case btnType === 'delete':
          initialGoodsName = goodsNameContainer.querySelector('[data-goods-name]').textContent;
          this.trigger('@showAlert', {
            view: this,
            description: '정말로 삭제하시겠습니까?',
            eventInfo: {
              eventName: 'extra-price-info__delete-item',
              goodsName: initialGoodsName,
            },
          });
          break;
        case btnType === 'confirm':
          const goodsNameInput = goodsNameContainer.querySelector('[data-name-input]');
          const goodsPriceInput = priceContainer.querySelector('[data-price-input]');
          initialGoodsName = goodsNameContainer.querySelector('[data-initial-name]').dataset.initialName;
          edittedGoodsName = goodsNameInput.value.trim();
          edittedPrice = goodsPriceInput.value.trim();

          if (edittedGoodsName.length === 0) return goodsNameInput.focus();
          if (edittedPrice.length === 0 || edittedPrice == 0) return goodsPriceInput.focus();

          this.trigger('@confirmEditItem', {
            view: this,
            initialGoodsName,
            edittedGoodsName,
            edittedPrice,
          });
          console.log({
            initialGoodsName,
            edittedGoodsName,
            edittedPrice,
          });
          break;
        case btnType === 'cancel':
          goodsNameContainer.innerHTML = this._template.getGoodsNameHtml(
            goodsNameContainer.querySelector('[data-initial-name]').dataset.initialName
          );

          priceContainer.innerHTML = this._template.getPriceHtml(
            priceContainer.querySelector('[data-initial-price]').dataset.initialPrice
          );

          btnContainer.innerHTML = this._template.getBtnsHtml();
          break;
        default:
          throw `${tag} 사용 불가능한 버튼 타입입니다`;
      }
    });

    this._itemList.addEventListener('input', event => {
      const inputEl = event.target;

      switch (true) {
        case inputEl.dataset.hasOwnProperty('nameInput'):
          if (inputEl.value.length > 50) inputEl.value = inputEl.value.substr(0, 50);
          break;

        case inputEl.dataset.hasOwnProperty('priceInput'):
          // 숫자만 입력
          inputEl.value = inputEl.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');
          // 9번째 자리수를 넘어갈 수 없음
          if (inputEl.value.length > 9) inputEl.value = inputEl.value.substr(0, 9);
          // 둘째자리 이상일때 맨앞에 0 제거
          if (inputEl.value.length > 1) inputEl.value = inputEl.value.replace(/(^0+)/, '');
          break;
        default:
          return;
      }
    });
  };
};

class Template {
  getEmptyItemHtml = () => {
    return `
        <li class="extra-price-empty-item" data-empty-item>상품을 추가해주세요</li>
        `;
  };
  getItemHtml = (name, price) => {
    return `
      <div class="extra-price-item__title-container" data-goods-name-container>
        <h3 class="extra-price-item__title" data-goods-name>${name}</h3>
      </div>
      <div class="extra-price-item__horizontal-line"></div>
      <div class="flex-start-container" data-price-container>
        <span class="extra-price-item__price" data-price>${price}</span>
        <span class="extra-price-item__won">원</span>
      </div>
      <div class="flex-start-container extra-price-item__btn-container" data-btn-container>
        <button class="extra-price-item__edit-btn" data-btn="edit">
          <i class="far fa-edit extra-price-item__edit-btn-icon"></i>
        </button>
        <button class="extra-price-item__delete-btn" data-btn="delete">
          <i class="fas fa-trash extra-price-item__delete-btn-icon"></i>
        </button>
      </div>
    `;
  };

  getItemsHtml = infoArray => {
    let initialHtml = '';
    return infoArray.reduce((html, item) => {
      const { goodsName, goodsPrice } = item;
      return (
        html +
        `
        <li class="extra-price-item" data-item>
          <div class="extra-price-item__title-container" data-goods-name-container>
            <h3 class="extra-price-item__title" data-goods-name>${goodsName}</h3>
          </div>
          <div class="extra-price-item__horizontal-line"></div>
          <div class="flex-start-container" data-price-container>
            <span class="extra-price-item__price" data-price>${goodsPrice}</span>
            <span class="extra-price-item__won">원</span>
          </div>
          <div class="flex-start-container extra-price-item__btn-container" data-btn-container>
            <button class="extra-price-item__edit-btn" data-btn="edit">
              <i class="far fa-edit extra-price-item__edit-btn-icon"></i>
            </button>
            <button class="extra-price-item__delete-btn" data-btn="delete">
              <i class="fas fa-trash extra-price-item__delete-btn-icon"></i>
            </button>
          </div>
        </li>
      `
      );
    }, initialHtml);
  };

  getGoodsNameHtml = name => {
    return `
      <h3 class="extra-price-item__title" data-goods-name>${name}</h3>
    `;
  };
  getPriceHtml = price => {
    return `
      <span class="extra-price-item__price" data-price>${price}</span>
      <span class="extra-price-item__won">원</span>
    `;
  };
  getBtnsHtml = () => {
    return `
        <button class="extra-price-item__edit-btn" data-btn="edit">
          <i class="far fa-edit extra-price-item__edit-btn-icon"></i>
        </button>
        <button class="extra-price-item__delete-btn" data-btn="delete">
          <i class="fas fa-trash extra-price-item__delete-btn-icon"></i>
        </button>
      `;
  };

  getEditStateNameInputHtml = name => {
    return `
        <input class="extra-price-item__price-name-input" type="text" value="${name}" placeholder="상품 이름 입력" data-initial-name="${name}" data-name-input/>
      `;
  };
  getEditStatePriceInputHtml = price => {
    const priceNum = price.replace(/,/g, '');
    return `
        <input class="extra-price-item__price-input" type="text" placeholder="가격 입력" value="${priceNum}" data-initial-price="${price}" data-price-input/>
      `;
  };
  getEditStateBtnsHtml = () => {
    return `
        <button class="extra-price-item__confirm-btn" data-btn="confirm">
          <i class="far fa-check-square extra-price-item__confirm-btn-icon"></i>
        </button>
        <button class="extra-price-item__cancel-btn" data-btn="cancel">
          <i class="fas fa-redo extra-price-item__cancel-btn-icon"></i>
        </button>
      `;
  };
}

export default ExtraPriceInfoView;
