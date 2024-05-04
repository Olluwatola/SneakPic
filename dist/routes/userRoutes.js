"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRoutesExports = void 0;
const express_1 = __importDefault(require("express"));
const authController_1 = require("./../controllers/authController");
const userController_1 = require("./../controllers/userController");
const userHandlers_1 = require("../handlers/userHandlers");
const router = express_1.default.Router();
router.post('/signup', authController_1.authControllerExports.signUp);
router.post('/login', authController_1.authControllerExports.login);
router.get('/requestmvc', authController_1.authControllerExports.requestMailVerificationCode);
//protected routes
router.use(userHandlers_1.userHandlerExports.protect);
router.get('/:id', userController_1.userControllerExports.getUser);
router.get('/', userController_1.userControllerExports.getAllUsers);
exports.userRoutesExports = {
    router: router,
};
