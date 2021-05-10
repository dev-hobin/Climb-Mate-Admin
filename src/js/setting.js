import '../scss/setting.scss';

import SettingController from './controller/SettingController.js';

const settingController = new SettingController();

document.addEventListener('DOMContentLoaded', () => settingController.init());
