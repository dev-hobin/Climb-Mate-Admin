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

const dummyCheckInfo = {
  [TOOL_TYPE.HEATH]: true,
  [TOOL_TYPE.TRAINING_BOARD]: false,
  [TOOL_TYPE.MOON_BOARD]: false,
  [TOOL_TYPE.KILTER_BOARD]: true,
};
const dummyExtraInfo = {
  [TOOL_EXTRA_INFO.HEALTH]: '여러 종류의 운동기구가 준비되어 있습니다!',
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
  initInfo = async centerId => {
    this._checkInfo.initial = { ...dummyCheckInfo };
    this._checkInfo.current = { ...dummyCheckInfo };

    this._extraInfo.initial = { ...dummyExtraInfo };
    this._extraInfo.current = { ...dummyExtraInfo };

    return [this._checkInfo.initial, this._extraInfo.initial];
  };
  updateCheckInfo = (tool, checked) => {
    this._checkInfo.current[tool] = checked;
    console.log(tag, '체크 정보 수정', this._checkInfo.current);
  };
  updateExtraInfo = (extra, info) => {
    this._extraInfo.current[extra] = info;
    console.log(tag, '엑스트라 정보 수정', this._extraInfo.current);
  };
  update = async () => {
    const isChanged = this._isInfoChanged();
    if (!isChanged)
      return {
        isSuccess: false,
        error: { sort: 'caution', title: '변경된 정보가 없습니다', description: '도구 정보를 변경해주세요' },
      };
    console.group(tag, '서버로 보낼 수 있는 정보');
    console.log('체크된 도구 정보', this._checkInfo.current);
    console.log('헬스 도구 설명', this._extraInfo.current);
    console.groupEnd();
    console.log(tag, '도구 업데이트 중');
    await new Promise(resolve => setTimeout(resolve, 3000));
    console.log(tag, '업데이트된 도구 정보로 기존 정보 업데이트');
    this._checkInfo.initial = { ...this._checkInfo.current };
    this._extraInfo.initial = { ...this._extraInfo.current };
    console.log(tag, '도구 업데이트 완료 후 결과 반환');
    return {
      isSuccess: true,
      error: '',
    };
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
};

export default ToolInfoModel;
