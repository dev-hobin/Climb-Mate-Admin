import '../scss/baseInfo.scss';

import BaseInfoController from './controller/BaseInfoController.js';

const baseInfoController = new BaseInfoController();

document.addEventListener('DOMContentLoaded', () => baseInfoController.init());
