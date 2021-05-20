import Model from '../core/Model.js';

const tag = '[ExtraPriceInfoModel]';

const dummyInfo = [
  {
    id: 2,
    goodsName: '추가 아이템 1',
    goodsPrice: 10000,
  },
  {
    id: 5,
    goodsName: '추가 아이템 2',
    goodsPrice: 20000,
  },
  {
    id: 6,
    goodsName: '추가 아이템 3',
    goodsPrice: 50000,
  },
  {
    id: 8,
    goodsName: '추가 아이템 4',
    goodsPrice: 80000,
  },
  {
    id: 9,
    goodsName: '추가 아이템 5',
    goodsPrice: 100000,
  },
];

const ExtraPriceInfoModel = class extends Model {
  constructor() {
    super();

    this._info = [];
  }

  /* 인터페이스 */
  initInfo = async centerId => {
    dummyInfo.forEach(info => this._info.push({ ...info }));
    const initialInfo = this._info.map(info => {
      info.goodsPrice = this._addCommas(info.goodsPrice);
      return info;
    });
    return initialInfo;
  };
  addItem = async (centerId, accessKey, goodsName, goodsPrice) => {
    if (this._hasSameName(goodsName))
      return {
        isSuccess: false,
        error: { sort: 'caution', title: '상품 추가 실패', description: '같은 이름의 상품이 있습니다' },
        data: {},
      };
    if (this._info.filter(info => info.goodsName === goodsName).length > 0)
      this._info.push({
        id: '서버에서 받아온 id',
        goodsName,
        goodsPrice,
      });
    console.log(tag, '아이템 추가중...');
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log(tag, '수정된 정보 { id, goodsName, goodsPrice }', this._info);
    console.log(tag, '가격 수정 완료');
    console.log(tag, '성공 결과 반환');
    return {
      isSuccess: true,
      error: {},
      data: {
        goodsName,
        goodsPrice: this._addCommas(goodsPrice),
      },
    };
  };

  /* 메소드 */
  _addCommas = price => price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  _hasSameName = goodsName => {
    if (this._info.filter(info => info.goodsName === goodsName).length > 0) return true;
    return false;
  };
};

export default ExtraPriceInfoModel;
