import Model from '../core/Model.js';

const tag = '[ToolInfoModel]';

export const TOOL_TYPE = {
  HEATH: 'health',
  TRAINING_BOARD: 'training-board',
  MOON_BOARD: 'moon-board',
  KILTER_BOARD: 'kilter-board',
};
export const TOOL_EXTRA_INFO = {
  HEALTH: 'health-description',
};

const TOOL_NAME_TO_TYPE_KEY = {
  '킬터 보드': 'KILTER_BOARD',
  '문 보드': 'MOON_BOARD',
  '헬스 도구': 'HEATH',
  '트레이닝 보드': 'TRAINING_BOARD',
};

const ToolInfoModel = class extends Model {
  constructor() {
    super();
    this._checkInfo = {
      initial: {},
      current: {},
    };
    this._extraInfo = {
      initial: {},
      current: {},
    };
  }

  /* 인터페이스 */
  initInfo = async accessToken => {
    const reqData = {
      reqCode: 3005,
      reqBody: { accessKey: accessToken },
    };
    const {
      resCode,
      resBody: {
        centerTool,
        detailCenterHealthTool: { detailCenterHealthTool },
      },
      resErr,
    } = await this.postRequest(this.HOST.SERVER, this.PATHS.MAIN, reqData);

    if (resCode == this.RES_CODE.FAIL)
      return {
        isSuccess: false,
        error: { sort: 'error', title: '서버 오류', description: resErr },
        data: {},
      };

    const checkInfo = this._makeCheckInfo(centerTool);
    this._checkInfo.initial = { ...checkInfo };
    this._checkInfo.current = { ...checkInfo };

    const extraInfo = this._makeExtraInfo(detailCenterHealthTool);
    this._extraInfo.initial = { ...extraInfo };
    this._extraInfo.current = { ...extraInfo };

    return {
      isSuccess: true,
      error: {},
      data: {
        checkInfo: this._checkInfo.initial,
        extraInfo: this._extraInfo.initial,
      },
    };
  };
  updateCheckInfo = (tool, checked) => {
    this._checkInfo.current[tool] = checked;
    console.log(tag, '체크 정보 수정', this._checkInfo.current);
  };
  updateExtraInfo = (extra, info) => {
    this._extraInfo.current[extra] = info;
    console.log(tag, '추가 정보 수정', this._extraInfo.current);
  };
  update = async (accessToken, centerId) => {
    const isChanged = this._isInfoChanged();
    if (!isChanged)
      return {
        isSuccess: false,
        error: { sort: 'caution', title: '변경된 정보가 없습니다', description: '도구 정보를 변경해주세요' },
        data: {},
      };
    console.group(tag, '서버로 보낼 수 있는 정보');
    console.log('체크된 도구 정보', this._checkInfo.current);
    console.log('헬스 도구 설명', this._extraInfo.current);
    console.groupEnd();
    console.log(tag, '도구 업데이트 중...');

    const reqData = {
      reqCode: 1101,
      reqBody: {
        accessKey: accessToken,
        id: centerId,
        healthToolCheck: this._checkInfo.current[TOOL_TYPE.HEATH] ? 1 : 2,
        trainingBoardCheck: this._checkInfo.current[TOOL_TYPE.TRAINING_BOARD] ? 1 : 2,
        moonBoardCheck: this._checkInfo.current[TOOL_TYPE.MOON_BOARD] ? 1 : 2,
        kilterBoardCheck: this._checkInfo.current[TOOL_TYPE.KILTER_BOARD] ? 1 : 2,
        detailCenterHealthTool: this._extraInfo.current[TOOL_EXTRA_INFO.HEALTH],
      },
    };
    console.log('보낸 데이터', reqData);
    const { resCode, resBody, resErr } = await this.postRequest(this.HOST.SERVER, this.PATHS.MAIN, reqData);
    console.log('결과', { resCode, resBody, resErr });
    if (resCode == this.RES_CODE.FAIL) {
      return {
        isSuccess: false,
        error: {
          sort: 'error',
          title: '서버 오류',
          description: '도구 정보를 수정하는데 실패했습니다',
        },
        data: {},
      };
    } else {
      this._checkInfo.initial = { ...this._checkInfo.current };
      this._extraInfo.initial = { ...this._extraInfo.current };
      return {
        isSuccess: true,
        error: {},
        data: {},
      };
    }
  };

  // 메소드
  _isInfoChanged = () => {
    const toolInitial = this._checkInfo.initial;
    const toolCurrent = this._checkInfo.current;

    const extraInitial = this._extraInfo.initial;
    const extaCurrent = this._extraInfo.current;

    for (const [key, value] of Object.entries(toolCurrent)) {
      if (value !== toolInitial[key]) return true;
    }
    if (extraInitial[TOOL_EXTRA_INFO.HEALTH] !== extaCurrent[TOOL_EXTRA_INFO.HEALTH]) return true;
    return false;
  };
  // 체크 정보 만들기
  _makeCheckInfo = tools => {
    const checkInfo = {};
    tools.forEach(toolInfo => {
      const { toolName, toolCheck } = toolInfo;
      const typeKey = TOOL_NAME_TO_TYPE_KEY[toolName];
      const isChecked = toolCheck == 1 ? true : false;

      checkInfo[TOOL_TYPE[typeKey]] = isChecked;
    });
    return checkInfo;
  };
  // 추가 정보 만들기
  _makeExtraInfo = description => {
    const extraInfo = {
      'health-description': description,
    };
    return extraInfo;
  };
};

export default ToolInfoModel;
