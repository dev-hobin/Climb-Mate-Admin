const tag = '[View]';

const View = class {
  // 초기화
  init = element => {
    if (!element) throw `${tag} 엘리먼트를 받지 못했습니다`;
    this._element = element;
    return this;
  };

  // 이벤트 핸들러 등록
  on = (eventName, handler) => {
    this._element.addEventListener(eventName, handler);
    return this;
  };

  // 이벤트 발생시키기
  trigger = (event, data) => {
    const customEvent = new CustomEvent(event, { detail: data });
    this._element.dispatchEvent(customEvent);
    return this;
  };
};

export default View;
