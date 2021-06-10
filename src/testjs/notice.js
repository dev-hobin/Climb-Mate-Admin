import '../scss/notice.scss';

import NoticeController from './controller/NoticeController.js';

const noticeController = new NoticeController();

document.addEventListener('DOMContentLoaded', () => noticeController.init());
