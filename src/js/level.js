import '../scss/level.scss';

import LevelController from './controller/LevelController.js';

const levelController = new LevelController();

document.addEventListener('DOMContentLoaded', () => levelController.init());
