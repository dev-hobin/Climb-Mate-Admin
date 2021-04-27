import '../scss/price.scss';

import PriceController from './controller/PriceController.js';

const priceController = new PriceController();

document.addEventListener('DOMContentLoaded', () => priceController.init());
