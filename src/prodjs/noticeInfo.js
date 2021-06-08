import '../scss/noticeInfo.scss';

import NoticeInfoController from './controller/NoticeInfoController.js';

const noticeInfoController = new NoticeInfoController();

document.addEventListener('DOMContentLoaded', () => noticeInfoController.init());
