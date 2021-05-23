import Model from '../core/Model.js';

const tag = '[LevelInfoModel]';

export const LEVEL_INFO_TYPE = {
  BORDERING: 'bordering',
  ENDURANCE: 'endurance',
};

const borderingDummy = [
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

  addItem = async (centerId, accessKey, type, color, colorName, levelName) => {
    if (this._hasSameColor(type, color))
      return {
        isSuccess: false,
        error: { sort: 'caution', title: '난이도 정보 추가 실패', description: '같은 색깔의 난이도가 존재합니다' },
        data: {},
      };
    if (this._hasSameColorName(type, colorName))
      return {
        isSuccess: false,
        error: { sort: 'caution', title: '난이도 정보 추가 실패', description: '같은 이름의 색깔이 존재합니다' },
        data: {},
      };
    if (this._hasSameColorName(type, levelName))
      return {
        isSuccess: false,
        error: { sort: 'caution', title: '난이도 정보 추가 실패', description: '같은 이름의 레벨이 존재합니다' },
        data: {},
      };
    console.log(tag, '아이템 추가중...');
    await new Promise(resolve => setTimeout(resolve, 1000));
    this._info[type].push({
      color,
      colorName,
      levelName,
    });
    console.log(tag, '추가후 난이도 정보', this._info[type]);
    console.log(tag, '난이도 추가 완료');
    console.log(tag, '성공 결과 반환');
    return {
      isSuccess: true,
      error: {},
      data: {
        color,
        colorName,
        levelName,
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
  _hasSameColor = (type, color) => {
    console.log(type, color);
    console.log(this._info);
    if (this._info[type].filter(info => info.color === color).length > 0) return true;
    return false;
  };
  _hasSameColorName = (type, colorName) => {
    if (this._info[type].filter(info => info.colorName === colorName).length > 0) return true;
    return false;
  };
  _hasSameLevelName = (type, levelName) => {
    if (this._info[type].filter(info => info.levelName === levelName).length > 0) return true;
    return false;
  };
};

export default LevelInfoModel;
