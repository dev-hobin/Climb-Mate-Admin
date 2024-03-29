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
    const { resCode, resBody: goodsArray, resErr } = await this.postRequest(this.HOST.SERVER, this.PATHS.MAIN, reqData);

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
    } = await this.postRequest(this.HOST.SERVER, this.PATHS.MAIN, reqData);

    if (resCode == this.RES_CODE.FAIL) {
      return {
        isSuccess: false,
        error: { sort: 'error', title: '서버 오류', description: resErr },
        data: {},
      };
    } else {
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
    }
  };
  deleteItem = async (accessToken, centerId, goodsName) => {
    if (!this._hasNamedItem(goodsName))
      return {
        isSuccess: false,
        error: { sort: 'caution', title: '상품 삭제 실패', description: '해당 상품이 존재하지 않습니다' },
        data: {},
      };
    const deletedItem = this._info.filter(info => info.goodsName === goodsName)[0];
    const { id, goodsPrice } = deletedItem;
    const price = this._removeCommas(goodsPrice);

    const reqData = {
      reqCode: 1202,
      reqBody: {
        accessKey: accessToken,
        id,
        goodsCenterId: centerId,
        goodsName,
        goodsPrice: price,
      },
    };

    console.log(reqData);
    const { resCode, resBody, resErr } = await this.postRequest(this.HOST.SERVER, this.PATHS.MAIN, reqData);
    console.log({ resCode, resBody, resErr });
    if (resCode == this.RES_CODE.FAIL) {
      return {
        isSuccess: false,
        error: {
          sort: 'error',
          title: '서버 오류',
          description: '상품 정보 삭제에 실패했습니다',
        },
        data: {},
      };
    } else {
      this._info = this._info.filter(info => info.goodsName !== goodsName);

      return {
        isSuccess: true,
        error: {},
        data: {
          goodsName,
        },
      };
    }
  };
  editItem = async (accessToken, initialGoodsName, edittedGoodsName, edittedPrice) => {
    if (!this._hasNamedItem(initialGoodsName))
      return {
        isSuccess: false,
        error: { sort: 'caution', title: '상품 수정 실패', description: '해당 상품이 존재하지 않습니다' },
        data: {},
      };

    const edittedItem = this._info.filter(info => info.goodsName === initialGoodsName)[0];
    const { id } = edittedItem;

    const reqData = {
      reqCode: 1203,
      reqBody: {
        accessKey: accessToken,
        id,
        goodsName: edittedGoodsName,
        goodsPrice: edittedPrice,
      },
    };
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
      this._info = this._info.map(info => {
        if (info.goodsName !== initialGoodsName) return info;
        info.goodsName = edittedGoodsName;
        info.goodsPrice = this._addCommas(edittedPrice);
        return info;
      });

      return {
        isSuccess: true,
        error: {},
        data: {
          initialGoodsName,
          edittedGoodsName,
          edittedPrice: this._addCommas(edittedPrice),
        },
      };
    }
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
  _removeCommas = price => price.replace(/,/gi, '');

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
