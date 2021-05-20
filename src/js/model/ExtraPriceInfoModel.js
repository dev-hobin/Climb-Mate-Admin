import Model from '../core/Model.js';

const tag = '[ExtraPriceInfoModel]';

const dummyInfo = [
  {
    id: 2,
    goodsName: '추가 아이템 1',
    goodsPrice: 10000,
    goodsType: 100,
  },
  {
    id: 5,
    goodsName: '추가 아이템 2',
    goodsPrice: 20000,
    goodsType: 101,
  },
  {
    id: 6,
    goodsName: '추가 아이템 3',
    goodsPrice: 50000,
    goodsType: 102,
  },
  {
    id: 8,
    goodsName: '추가 아이템 4',
    goodsPrice: 80000,
    goodsType: 103,
  },
  {
    id: 9,
    goodsName: '추가 아이템 5',
    goodsPrice: 100000,
    goodsType: 104,
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

  /* 메소드 */
  _addCommas = price => price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

export default ExtraPriceInfoModel;
