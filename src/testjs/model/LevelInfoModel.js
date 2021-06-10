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
  initInfo = async (accessToken, type) => {
    // 초기화
    this._info[type] = [];

    if (type === LEVEL_INFO_TYPE.BORDERING) {
      const reqData = {
        reqCode: 3012,
        reqBody: {
          accessKey: accessToken,
        },
      };

      const {
        resCode,
        resBody: borderingLevelInfo,
        resErr,
      } = await this.postRequest(this.HOST.SERVER, this.PATHS.MAIN, reqData);

      console.log('볼더링 난이도 정보', borderingLevelInfo);

      if (resCode == this.RES_CODE.FAIL) {
        return {
          isSuccess: false,
          error: {
            sort: 'error',
            title: '서버 오류',
            description: '볼더링 난이도 정보를 가져오는데 실패했습니다',
          },
          data: {},
        };
      } else {
        borderingLevelInfo.forEach(info => this._info[type].push({ ...info }));

        return {
          isSuccess: true,
          error: {},
          data: {
            levelInfo: borderingLevelInfo,
          },
        };
      }
    } else if (type === LEVEL_INFO_TYPE.ENDURANCE) {
      const reqData = {
        reqCode: 3013,
        reqBody: {
          accessKey: accessToken,
        },
      };

      const {
        resCode,
        resBody: enduranceLevelInfo,
        resErr,
      } = await this.postRequest(this.HOST.SERVER, this.PATHS.MAIN, reqData);
      console.log('지구력 난이도 정보', enduranceLevelInfo);

      if (resCode == this.RES_CODE.FAIL) {
        return {
          isSuccess: false,
          error: {
            sort: 'error',
            title: '서버 오류',
            description: '지구력 난이도 정보를 가져오는데 실패했습니다',
          },
          data: {},
        };
      } else {
        enduranceLevelInfo.forEach(info => this._info[type].push({ ...info }));

        return {
          isSuccess: true,
          error: {},
          data: {
            levelInfo: enduranceLevelInfo,
          },
        };
      }
    } else throw '사용 가능한 난이도 타입이 아닙니다';
  };

  addItem = async (accessToken, centerId, type, color, colorName, levelName) => {
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

    const reqData = {
      reqCode: 1401,
      reqBody: {
        accessKey: accessToken,
        settingCenterId: centerId,
        settingColor: color,
        settingColorName: colorName,
        settingLevelName: levelName,
      },
    };

    if (type === LEVEL_INFO_TYPE.BORDERING) {
      reqData.reqBody['settingLevel'] = '볼더링';
      reqData.reqBody['settingCenterDifficulty'] = this._info[type].length + 1;
    } else if (type === LEVEL_INFO_TYPE.ENDURANCE) {
      reqData.reqBody['settingLevel'] = '지구력';
      reqData.reqBody['settingCenterDifficulty'] = this._info[type].length + 1;
    } else throw '사용 가능한 레벨 타입이 아닙니다';

    const { resCode, resBody, resErr } = await this.postRequest(this.HOST.SERVER, this.PATHS.MAIN, reqData);

    if (resCode == this.RES_CODE.FAIL) {
      return {
        isSuccess: false,
        error: { sort: 'error', title: '서버 오류', description: resErr },
        data: {},
      };
    } else {
      return {
        isSuccess: true,
        error: {},
        data: {},
      };
    }
  };
  deleteItem = async (accessToken, centerId, type, color, levelName) => {
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

    // 삭제할 아이템 정보
    const willDeletedItem = this._info[type].find(item => item.settingColor === color);
    const { id, settingCenterDifficulty, settingLevel } = willDeletedItem;

    const reqData = {
      reqCode: 1403,
      reqBody: {
        accessKey: accessToken,
        settingCenterId: centerId,
        id,
        settingCenterDifficulty,
        settingLevel,
      },
    };

    const { resCode, resBody, resErr } = await this.postRequest(this.HOST.SERVER, this.PATHS.MAIN, reqData);

    if (resCode == this.RES_CODE.FAIL) {
      return {
        isSuccess: false,
        error: { sort: 'error', title: '서버 오류', description: resErr },
        data: {},
      };
    } else {
      return {
        isSuccess: true,
        error: {},
        data: {},
      };
    }
  };
  editItem = async (
    accessToken,
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

    const willEdittedItem = this._info[type].find(item => item.settingColor === initialColor);
    const { id, settingCenterDifficulty, settingColor, settingColorName, settingLevelName } = willEdittedItem;

    const reqData = {
      reqCode: 1402,
      reqBody: {
        accessKey: accessToken,
        id,
        settingCenterDifficulty,
        settingColor: currentColor,
        settingColorName: currentColorName,
        settingLevelName: currentLevelName,
      },
    };
    console.log(reqData);
    const { resCode, resBody, resErr } = await this.postRequest(this.HOST.SERVER, this.PATHS.MAIN, reqData);
    console.log({ resCode, resBody, resErr });

    if (resCode == this.RES_CODE.FAIL) {
      return {
        isSuccess: false,
        error: { sort: 'error', title: '서버 오류', description: resErr },
        data: {},
      };
    } else {
      return {
        isSuccess: true,
        error: {},
        data: {},
      };
    }
  };

  /* 메소드 */
  _hasSameColor = (type, color) => {
    if (this._info[type].find(info => info.settingColor === color)) return true;
    return false;
  };
  _hasSameColorName = (type, colorName) => {
    if (this._info[type].find(info => info.settingColorName === colorName)) return true;
    return false;
  };
  _hasSameLevelName = (type, levelName) => {
    if (this._info[type].find(info => info.settingLevelName === levelName)) return true;
    return false;
  };

  _hasAnotherSameColor = (type, initialColor, currentColor) => {
    if (this._info[type].find(info => info.settingColor !== initialColor && info.settingColor === currentColor))
      return true;
    return false;
  };
  _hasAnotherSameColorName = (type, initialColorName, currentColorName) => {
    if (
      this._info[type].find(
        info => info.settingColorName !== initialColorName && info.settingColorName === currentColorName
      )
    ) {
      return true;
    } else {
      return false;
    }
  };
  _hasAnotherSameLevelName = (type, initialLevelName, currentLevelName) => {
    if (
      this._info[type].find(
        info => info.settingLevelName !== initialLevelName && info.settingLevelName === currentLevelName
      )
    ) {
      return true;
    } else {
      return false;
    }
  };
};

export default LevelInfoModel;
