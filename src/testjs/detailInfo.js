import '../scss/detailInfo.scss';

import DetailInfoController from './controller/DetailInfoController.js';

const detailInfoController = new DetailInfoController();

document.addEventListener('DOMContentLoaded', () => detailInfoController.init());
