import '../scss/banner.scss';

import BannerController from './controller/BannerController.js';

const bannerController = new BannerController();

document.addEventListener('DOMContentLoaded', () => bannerController.init());
