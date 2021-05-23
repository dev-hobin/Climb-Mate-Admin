import Model from '../core/Model.js';

const tag = '[LevelInfoModel]';

const LEVEL_INFO_TYPE = {
  BORDERING: 'bordering',
  ENDURANCE: 'endurance',
};

const borderingDummy = [
  {
    level: 1,
    color: '#7ec147',
    colorName: '연두색',
    levelName: 'v0',
  },
  {
    level: 2,
    color: '#006edb',
    colorName: '파란색',
    levelName: 'v1',
  },
  {
    level: 3,
    color: '#fb3a50',
    colorName: '빨간색',
    levelName: 'v2',
  },
  {
    level: 4,
    color: '#808080',
    colorName: '회색',
    levelName: 'v3',
  },
  {
    level: 5,
    color: '#333333',
    colorName: '검은색',
    levelName: 'v4',
  },
];
const enduranceDummy = [
  {
    color: '#7ec147',
    colorName: '연두색',
    levelName: 'v0',
  },
  {
    color: '#006edb',
    colorName: '파란색',
    levelName: 'v1',
  },
  {
    color: '#fb3a50',
    colorName: '빨간색',
    levelName: 'v2',
  },
  {
    color: '#808080',
    colorName: '회색',
    levelName: 'v3',
  },
  {
    color: '#333333',
    colorName: '검은색',
    levelName: 'v4',
  },
];

const LevelInfoModel = class extends Model {
  constructor() {
    super();

    this._info = {
      [LEVEL_INFO_TYPE.BORDERING]: [],
      [LEVEL_INFO_TYPE.ENDURANCE]: [],
    };
  }

  /* 인터페이스 */
  initInfo = async centerId => {
    borderingDummy.forEach(info => this._info[LEVEL_INFO_TYPE.BORDERING].push({ ...info }));
    enduranceDummy.forEach(info => this._info[LEVEL_INFO_TYPE.ENDURANCE].push({ ...info }));

    return [this._info[LEVEL_INFO_TYPE.BORDERING], this._info[LEVEL_INFO_TYPE.ENDURANCE]];
  };
  addItem = async (centerId, accessKey, goodsName, goodsPrice) => {
    if (this._hasSameName(goodsName))
      return {
        isSuccess: false,
        error: { sort: 'caution', title: '상품 추가 실패', description: '같은 이름의 상품이 있습니다' },
        data: {},
      };
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
  _hasSameName = goodsName => {
    if (this._info.filter(info => info.goodsName === goodsName).length > 0) return true;
    return false;
  };
  _hasNamedItem = goodsName => {
    if (this._info.filter(info => info.goodsName === goodsName).length > 0) return true;
    return false;
  };
};

export default LevelInfoModel;
