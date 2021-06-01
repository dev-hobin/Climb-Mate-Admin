import Model from '../core/Model.js';

const tag = '[LevelInfoModel]';

export const LEVEL_INFO_TYPE = {
  BORDERING: 'bordering',
  ENDURANCE: 'endurance',
};

const LevelInfoModel = class extends Model {
  constructor() {
    super();

    this._info = {
      [LEVEL_INFO_TYPE.BORDERING]: [],
      [LEVEL_INFO_TYPE.ENDURANCE]: [],
    };
  }

  /* 인터페이스 */
  initInfo = async accessToken => {
    const borderingReqData = {
      reqCode: 3012,
      reqBody: {
        accessKey: accessToken,
      },
    };
    const {
      resCode: borderingResCode,
      resBody: borderingLevelInfo,
      resErr: borderingResErr,
    } = await this.postRequest(this.HOST.TEST_SERVER, this.PATHS.MAIN, borderingReqData);
    console.log('볼더링 난이도 정보', borderingLevelInfo);

    let borderingResResult;
    if (borderingResCode == this.RES_CODE.FAIL) {
      borderingResResult = {
        isSuccess: false,
        error: {
          sort: 'error',
          title: '서버 오류',
          description: '볼더링 난이도 정보를 가져오는데 실패했습니다',
        },
        data: {},
      };
    } else {
      borderingResResult = {
        isSuccess: true,
        error: {},
        data: {
          levelInfo: borderingLevelInfo,
        },
      };
      borderingLevelInfo.forEach(info => this._info[LEVEL_INFO_TYPE.BORDERING].push({ ...info }));
    }

    const enduranceReqData = {
      reqCode: 3013,
      reqBody: {
        accessKey: accessToken,
      },
    };
    const {
      resCode: enduranceResCode,
      resBody: enduranceLevelInfo,
      resErr: enduranceResErr,
    } = await this.postRequest(this.HOST.TEST_SERVER, this.PATHS.MAIN, enduranceReqData);
    console.log('지구력 난이도 정보', enduranceLevelInfo);

    let enduranceResResult;
    if (enduranceResCode == this.RES_CODE.FAIL) {
      enduranceResResult = {
        isSuccess: false,
        error: {
          sort: 'error',
          title: '서버 오류',
          description: '지구력 난이도 정보를 가져오는데 실패했습니다',
        },
        data: {},
      };
    } else {
      enduranceResResult = {
        isSuccess: true,
        error: {},
        data: {
          levelInfo: enduranceLevelInfo,
        },
      };
      enduranceLevelInfo.forEach(info => this._info[LEVEL_INFO_TYPE.ENDURANCE].push({ ...info }));
    }

    return [borderingResResult, enduranceResResult];
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
