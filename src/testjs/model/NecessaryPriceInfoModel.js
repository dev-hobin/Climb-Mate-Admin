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

const NecessaryPriceInfoModel = class extends Model {
  constructor() {
    super();
    this._info = {};
  }

  /* 인터페이스 */
  initInfo = async accessToken => {
    const reqData = {
      reqCode: 3007,
      reqBody: {
        accessKey: accessToken,
      },
    };
    const { resCode, resBody: goodsArray, resErr } = await this.postRequest(this.HOST.SERVER, this.PATHS.MAIN, reqData);

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
    this._info = goodsInfo;
    console.log(this._info);
    return {
      isSuccess: true,
      error: {},
      data: {
        goodsInfo: this._info,
      },
    };
  };
  editPrice = async (accessToken, centerId, goodsType, price) => {
    const reqData = {
      reqCode: 1200,
      reqBody: {
        accessKey: accessToken,
        goodsCenterId: centerId,
        goodsType,
        [GOODS_TYPE_TO_KEY[1]]: this._removeCommas(this._info[1]['price']),
        [GOODS_TYPE_TO_KEY[2]]: this._removeCommas(this._info[2]['price']),
        [GOODS_TYPE_TO_KEY[3]]: this._removeCommas(this._info[3]['price']),
        [GOODS_TYPE_TO_KEY[4]]: this._removeCommas(this._info[4]['price']),
        [GOODS_TYPE_TO_KEY[5]]: this._removeCommas(this._info[5]['price']),
      },
    };
    reqData['reqBody'][GOODS_TYPE_TO_KEY[goodsType]] = price;

    console.log(reqData);

    const { resCode, resBody, resErr } = await this.postRequest(this.HOST.SERVER, this.PATHS.MAIN, reqData);

    console.log({ resCode, resBody, resErr });
    if (resCode == this.RES_CODE.FAIL) {
      return {
        isSuccess: false,
        error: {
          sort: 'error',
          title: '서버 오류',
          description: '상품 정보 수정에 실패했습니다',
        },
        data: {},
      };
    } else {
      this._info[goodsType]['price'] = this._addCommas(price);

      return {
        isSuccess: true,
        error: {},
        data: {
          price: this._addCommas(price),
        },
      };
    }
  };
  /* 메소드 */
  _addCommas = price => price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  _removeCommas = price => price.replace(/,/gi, '');
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
