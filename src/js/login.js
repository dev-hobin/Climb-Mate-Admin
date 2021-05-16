import '../scss/login.scss';

import LoginController from './controller/LoginController.js';

const loginController = new LoginController();

document.addEventListener('DOMContentLoaded', () => loginController.init());
