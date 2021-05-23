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
    if (this._hasSameLevelName(type, levelName))
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
  deleteItem = async (centerId, accessKey, type, color, levelName) => {
    if (!this._hasSameColor(type, color))
      return {
        isSuccess: false,
        error: {
          sort: 'caution',
          title: '난이도 정보 삭제 실패',
          description: '삭제할 아이템 정보가 존재하지 않습니다',
        },
        data: {},
      };
    if (!this._hasSameLevelName(type, levelName))
      return {
        isSuccess: false,
        error: {
          sort: 'caution',
          title: '난이도 정보 삭제 실패',
          description: '삭제할 아이템 정보가 존재하지 않습니다',
        },
        data: {},
      };
    console.log(tag, '아이템 삭제중...');
    await new Promise(resolve => setTimeout(resolve, 1000));
    this._info[type] = this._info[type].filter(info => {
      if (info.color !== color || info.levelName !== levelName) return true;
      return false;
    });
    console.log(tag, '삭제후 난이도 정보', this._info[type]);
    console.log(tag, '난이도 아이템 삭제 완료');
    console.log(tag, '성공 결과 반환');
    return {
      isSuccess: true,
      error: {},
      data: {
        itemList: this._info[type],
      },
    };
  };
  editItem = async (
    centerId,
    accessKey,
    type,
    initialColor,
    initialColorName,
    initialLevelName,
    currentColor,
    currentColorName,
    currentLevelName
  ) => {
    if (this._hasAnotherSameColor(type, initialColor, currentColor))
      return {
        isSuccess: false,
        error: {
          sort: 'caution',
          title: '난이도 정보 수정 실패',
          description: '같은 색깔의 아이템이 존재합니다',
        },
        data: {},
      };
    if (this._hasAnotherSameColorName(type, initialColorName, currentColorName))
      return {
        isSuccess: false,
        error: {
          sort: 'caution',
          title: '난이도 정보 수정 실패',
          description: '같은 색깔 이름을 가진 아이템이 존재합니다',
        },
        data: {},
      };
    if (this._hasAnotherSameLevelName(type, initialLevelName, currentLevelName))
      return {
        isSuccess: false,
        error: {
          sort: 'caution',
          title: '난이도 정보 수정 실패',
          description: '같은 난이도 이름을 가진 아이템이 존재합니다',
        },
        data: {},
      };
    console.log(tag, '아이템 수정중...');
    await new Promise(resolve => setTimeout(resolve, 1000));
    this._info[type] = this._info[type].map(info => {
      if (info.color !== initialColor || info.levelName !== initialLevelName) return info;
      info.color = currentColor;
      info.colorName = currentColorName;
      info.levelName = currentLevelName;
      return info;
    });
    console.log(tag, '수정 후 난이도 정보', this._info[type]);
    console.log(tag, '난이도 아이템 수정 완료');
    console.log(tag, '성공 결과 반환');
    return {
      isSuccess: true,
      error: {},
      data: {
        edittedColor: currentColor,
        edittedColorName: currentColorName,
        edittedLevelName: currentLevelName,
      },
    };
  };

  /* 메소드 */
  _hasSameColor = (type, color) => {
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

  _hasAnotherSameColor = (type, initialColor, currentColor) => {
    if (this._info[type].filter(info => info.color !== initialColor && info.color === currentColor).length > 0)
      return true;
    return false;
  };
  _hasAnotherSameColorName = (type, initialColorName, currentColorName) => {
    if (
      this._info[type].filter(info => info.colorName !== initialColorName && info.colorName === currentColorName)
        .length > 0
    )
      return true;
    return false;
  };
  _hasAnotherSameLevelName = (type, initialLevelName, currentLevelName) => {
    if (
      this._info[type].filter(info => info.levelName !== initialLevelName && info.levelName === currentLevelName)
        .length > 0
    )
      return true;
    return false;
  };
};

export default LevelInfoModel;
