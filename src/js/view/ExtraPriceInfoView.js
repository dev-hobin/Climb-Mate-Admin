import View from '../core/View';
const tag = '[ExtraPriceInfoView]';

const ExtraPriceInfoView = class extends View {
  constructor() {
    super();

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

    console.log(`${tag} setup()`);
    return this;
  };
  initInfo = (infoArray = []) => {
    if (infoArray.length === 0) return (this._itemList.innerHTML = this._template.getEmptyItemHtml());
    this._itemList.innerHTML = this._template.getItemsHtml(infoArray);
  };

  /* 메소드 */
  _bindEvents = () => {
    this._priceInput.addEventListener('input', event => {
      const priceInput = event.target;
      // 숫자만 입력
      priceInput.value = priceInput.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');
      // 둘째자리 이상일때 맨앞에 0 제거
      if (priceInput.value.length > 1) priceInput.value = priceInput.value.replace(/(^0+)/, '');
      // 초기값은 0
      if (priceInput.value.length === 0) priceInput.value = 0;
    });

    this._addBtn.addEventListener('click', () => {
      console.log('아이템 추가');
    });

    this._itemList.addEventListener('click', event => {
      const btnType = event.target.dataset.btn;
      if (!btnType) return;
      const item = event.target.closest('[data-item]');
      const goodsNameContainer = item.querySelector('[data-goods-name-container]');
      const priceContainer = item.querySelector('[data-price-container]');
      const btnContainer = item.querySelector('[data-btn-container]');

      switch (true) {
        case btnType === 'edit':
          const name = goodsNameContainer.querySelector('[data-goods-name]').textContent;
          goodsNameContainer.innerHTML = this._template.getEditStateNameInputHtml(name);

          const price = priceContainer.querySelector('[data-price]').textContent;
          priceContainer.innerHTML = this._template.getEditStatePriceInputHtml(price);

          btnContainer.innerHTML = this._template.getEditStateBtnsHtml();
          break;
        case btnType === 'delete':
          console.log('delete');
          break;
        case btnType === 'confirm':
          // const priceInputValue = priceContainer.querySelector('[data-price-input]').value;
          // this.trigger('@confirmPriceEdit', { goodsType, priceType, price: priceInputValue });
          console.log('confirm');
          break;
        case btnType === 'cancel':
          const initialGoodsName = goodsNameContainer.querySelector('[data-initial-name]').dataset.initialName;
          goodsNameContainer.innerHTML = this._template.getGoodsNameHtml(initialGoodsName);

          const initialPrice = priceContainer.querySelector('[data-initial-price]').dataset.initialPrice;
          priceContainer.innerHTML = this._template.getPriceHtml(initialPrice);

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
          // ? 이름 인풋값 예외처리 할 수 있는 곳 -> 일단 데이터 보낼 때 trim으로 보내는 걸로 함
          break;

        case inputEl.dataset.hasOwnProperty('priceInput'):
          // 숫자만 입력
          inputEl.value = inputEl.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');
          // 둘째자리 이상일때 맨앞에 0 제거
          if (inputEl.value.length > 1) inputEl.value = inputEl.value.replace(/(^0+)/, '');
          // 초기값은 0
          if (inputEl.value.length === 0) inputEl.value = 0;
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
    const priceNum = price.replace(/,/, '');
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
