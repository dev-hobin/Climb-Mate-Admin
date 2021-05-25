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
  initInfo = async accessToken => {
    console.log('필수 상품 정보 더미 데이터 { 상품 타입 : 가격 }', dummyInfo);
    const reqData = {
      reqCode: 3007,
      reqBody: {
        accessKey: accessToken,
      },
    };
    const {
      resCode,
      resBody: goodsArray,
      resErr,
    } = await this.postRequest(this.HOST.TEST_SERVER, this.PATHS.MAIN, reqData);

    if (resCode == this.RES_CODE.FAIL)
      return {
        isSuccess: false,
        error: {
          sort: 'error',
          title: '서버 오류',
          description: '필수 상품 정보를 가져오는데 실패했습니다',
        },
        data: {},
      };

    const goodsInfo = this._makeInfo(goodsArray);
    console.log(goodsInfo);
    this._info = goodsInfo;
    return {
      isSuccess: true,
      error: {},
      data: {
        goodsInfo: this._info,
      },
    };
  };
  editPrice = async (goodsType, price) => {
    console.log(tag, '가격 수정중...');
    await new Promise(resolve => setTimeout(resolve, 1000));
    this._info[goodsType]['price'] = this._addCommas(price);
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
  _makeInfo = goodsArray => {
    const info = {};
    goodsArray.forEach(goodsInfo => {
      const { id, goodsName, goodsType, goodsPrice } = goodsInfo;
      info[goodsType] = {
        id,
        price: this._addCommas(goodsPrice),
      };
    });
    return info;
  };
};

export default NecessaryPriceInfoModel;
