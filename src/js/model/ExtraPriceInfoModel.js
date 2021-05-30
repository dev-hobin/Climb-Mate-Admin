import Model from '../core/Model.js';

const tag = '[ExtraPriceInfoModel]';

const ExtraPriceInfoModel = class extends Model {
  constructor() {
    super();

    this._info = [];
  }

  /* 인터페이스 */
  initInfo = async accessToken => {
    const reqData = {
      reqCode: 3008,
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
          description: '추가 상품 정보를 가져오는데 실패했습니다',
        },
        data: {},
      };

    const goodsInfo = this._makeInfo(goodsArray);
    this._info = goodsInfo;
    return {
      isSuccess: true,
      error: {},
      data: {
        goodsInfo: this._info,
      },
    };
  };
  addItem = async (accessToken, centerId, goodsName, goodsPrice) => {
    if (this._hasSameName(goodsName))
      return {
        isSuccess: false,
        error: { sort: 'caution', title: '상품 추가 실패', description: '같은 이름의 상품이 있습니다' },
        data: {},
      };

    const reqData = {
      reqCode: 1201,
      reqBody: {
        accessKey: accessToken,
        goodsCenterId: centerId,
        goodsPrice,
        goodsName,
      },
    };

    const {
      resCode,
      resBody: { id },
      resErr,
    } = await this.postRequest(this.HOST.TEST_SERVER, this.PATHS.MAIN, reqData);

    if (resCode == this.RES_CODE.FAIL)
      return {
        isSuccess: false,
        error: { sort: 'error', title: '서버 오류', description: resErr },
        data: {},
      };

    this._info.push({
      id: id,
      goodsName,
      goodsPrice: this._addCommas(goodsPrice),
    });

    return {
      isSuccess: true,
      error: {},
      data: {
        goodsName,
        goodsPrice: this._addCommas(goodsPrice),
      },
    };
  };
  deleteItem = async (centerId, accessKey, goodsName) => {
    if (!this._hasNamedItem(goodsName))
      return {
        isSuccess: false,
        error: { sort: 'caution', title: '상품 삭제 실패', description: '해당 상품이 존재하지 않습니다' },
        data: {},
      };
    this._info = this._info.filter(info => info.goodsName !== goodsName);
    console.log(this._info);
    console.log(tag, '아이템 삭제중...');
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log(tag, '수정된 정보', this._info);
    console.log(tag, '아이템 삭제 성공');
    console.log(tag, '성공 결과 반환');
    return {
      isSuccess: true,
      error: {},
      data: {
        goodsName,
      },
    };
  };
  editItem = async (accessKey, initialGoodsName, edittedGoodsName, edittedPrice) => {
    if (!this._hasNamedItem(initialGoodsName))
      return {
        isSuccess: false,
        error: { sort: 'caution', title: '상품 수정 실패', description: '해당 상품이 존재하지 않습니다' },
        data: {},
      };

    this._info = this._info.map(info => {
      if (info.goodsName !== initialGoodsName) return info;
      info.goodsName = edittedGoodsName;
      info.goodsPrice = this._addCommas(edittedPrice);
      return info;
    });
    console.log(tag, '아이템 수정중...');
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log(tag, '수정된 정보', this._info);
    console.log(tag, '아이템 수정 성공');
    console.log(tag, '성공 결과 반환');
    return {
      isSuccess: true,
      error: {},
      data: {
        initialGoodsName,
        edittedGoodsName,
        edittedPrice: this._addCommas(edittedPrice),
      },
    };
  };

  /* 메소드 */
  _makeInfo = goodsArray => {
    const info = [];
    goodsArray.forEach(goodsInfo => {
      const { id, goodsName, goodsPrice } = goodsInfo;
      info.push({
        id,
        goodsName,
        goodsPrice: this._addCommas(goodsPrice),
      });
    });
    return info;
  };
  _addCommas = price => price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  _hasSameName = goodsName => {
    if (this._info.filter(info => info.goodsName === goodsName).length > 0) return true;
    return false;
  };
  _hasNamedItem = goodsName => {
    if (this._info.filter(info => info.goodsName === goodsName).length > 0) return true;
    return false;
  };
};

export default ExtraPriceInfoModel;
