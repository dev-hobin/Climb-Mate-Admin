import View from '../core/View';
import { NECESSARY_GOODS_TYPE } from '../model/NecessaryPriceInfoModel';
const tag = '[NecessaryPriceInfoView]';

const NecessaryPriceInfoView = class extends View {
  constructor() {
    super();

    this.clickable = true;

    this._template = new Template();
  }

  /* 인터페이스 */
  setup = element => {
    this.init(element);

    this._itemList = element.querySelector('[data-price-list]');
    this._items = Array.from(element.querySelectorAll('[data-item]'));

    this._bindEvents();

    return this;
  };
  initInfo = infoObj => {
    this._items.forEach((item, index) => {
      item.querySelector('[data-price]').textContent = infoObj[index + 1]['price'];
    });
  };
  setPrice = (priceType, price) => {
    const item = this._items.filter(item => item.dataset.item === priceType)[0];
    const priceContainer = item.querySelector('[data-price-container]');
    const btnContainer = item.querySelector('[data-btn-container]');

    priceContainer.innerHTML = this._template.getPriceHtml(price);
    btnContainer.innerHTML = this._template.getEditBtn();
  };

  /* 메소드 */
  _bindEvents = () => {
    this._itemList.addEventListener('click', event => {
      if (!this.clickable) return;
      const btnType = event.target.dataset.btn;
      if (!btnType) return;
      const item = event.target.closest('[data-item]');
      const priceType = item.dataset.item;
      const priceContainer = item.querySelector('[data-price-container]');
      const btnContainer = item.querySelector('[data-btn-container]');
      const goodsType = NECESSARY_GOODS_TYPE[priceType];

      switch (true) {
        case btnType === 'edit':
          const price = priceContainer.querySelector('[data-price]').textContent;
          priceContainer.innerHTML = this._template.getPriceInputHtml(price);
          btnContainer.innerHTML = this._template.getEditStateBtnsHtml();
          break;
        case btnType === 'confirm':
          const priceInputValue = priceContainer.querySelector('[data-price-input]').value;
          this.trigger('@confirmPriceEdit', { view: this, goodsType, priceType, price: priceInputValue });
          break;
        case btnType === 'cancel':
          const initialPrice = priceContainer.querySelector('[data-initial-price]').dataset.initialPrice;
          priceContainer.innerHTML = this._template.getPriceHtml(initialPrice);
          btnContainer.innerHTML = this._template.getEditBtn();
          break;
        default:
          throw `${tag} 사용 불가능한 버튼 타입입니다`;
      }
    });

    this._itemList.addEventListener('input', event => {
      const priceInput = event.target;
      // 숫자만 입력
      priceInput.value = priceInput.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');
      // 둘째자리 이상일때 맨앞에 0 제거
      if (priceInput.value.length > 1) priceInput.value = priceInput.value.replace(/(^0+)/, '');
      // 초기값은 0
      if (priceInput.value.length === 0) priceInput.value = 0;
    });
  };
};

class Template {
  getPriceHtml = price => {
    return `
            <span class="necessary-price-item__price" data-price>${price}</span>
            <span class="necessary-price-item__won">원</span>
        `;
  };
  getPriceInputHtml = price => {
    const priceNum = price.replace(/,/, '');
    return `
        <input class="necessary-price-item__price-input" type="text" placeholder="가격 입력" value="${priceNum}" data-initial-price="${price}" data-price-input/>
      `;
  };
  getEditStateBtnsHtml = () => {
    return `
        <button class="necessary-price-item__confirm-btn" data-btn="confirm">
          <i class="far fa-check-square necessary-price-item__confirm-btn-icon"></i>
        </button>
        <button class="necessary-price-item__cancel-btn" data-btn="cancel">
          <i class="fas fa-redo necessary-price-item__cancel-btn-icon"></i>
        </button>
      `;
  };
  getEditBtn = () => {
    return `
        <button class="necessary-price-item__edit-btn" data-btn="edit">
            <i class="far fa-edit necessary-price-item__edit-btn-icon"></i>
        </button>
      `;
  };
}

export default NecessaryPriceInfoView;
