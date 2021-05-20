import Model from '../core/Model.js';

const tag = '[NecessaryPriceInfoModel]';

const NECESSARY_PRICE_TYPE = {
  ONE_DAY_PASS: 'one-day-pass',
  ONE_DAY_CLASS: 'one-day-class',
  ONE_DAY_CLASS_PLUS_PRICE: 'one-day-class-plus-price',
  ONE_MONTH_CLASS: 'one-month-class',
  THREE_MONTH_CLASS: 'three-month-class',
};
export const NECESSARY_GOODS_TYPE = {
  [NECESSARY_PRICE_TYPE.ONE_DAY_PASS]: 1,
  [NECESSARY_PRICE_TYPE.ONE_DAY_CLASS]: 2,
  [NECESSARY_PRICE_TYPE.ONE_DAY_CLASS_PLUS_PRICE]: 3,
  [NECESSARY_PRICE_TYPE.ONE_MONTH_CLASS]: 4,
  [NECESSARY_PRICE_TYPE.THREE_MONTH_CLASS]: 5,
};
const GOODS_TYPE_TO_KEY = {
  1: 'onedayPassPrice',
  2: 'onedayClassPrice',
  3: 'onedayClassPlusPrice',
  4: 'oneMonthClassPrice',
  5: 'threeMonthClassPrice',
};
const dummyInfo = {
  1: 0,
  2: 0,
  3: 0,
  4: 0,
  5: 0,
};

const NecessaryPriceInfoModel = class extends Model {
  constructor() {
    super();
    this._info = {};
  }

  /* 인터페이스 */
  initInfo = async centerId => {
    this._info = { ...dummyInfo };
    return this._info;
  };
  editPrice = async (goodsType, priceType, price) => {
    this._info[goodsType] = price;
    console.log(tag, '가격 수정중...');
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log(tag, '수정된 정보 { goodsType, price }', this._info);
    console.log(tag, '가격 수정 완료');
    console.log(tag, '성공 결과 반환');
    return {
      isSuccess: true,
      error: {},
      data: {
        price: this._addCommas(price),
      },
    };
  };
  /* 메소드 */
  _addCommas = price => price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

export default NecessaryPriceInfoModel;
