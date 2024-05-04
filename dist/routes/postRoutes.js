"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postRoutesExports = void 0;
const express_1 = __importDefault(require("express"));
const postController_1 = require("./../controllers/postController");
const userHandlers_1 = require("./../handlers/userHandlers");
const router = express_1.default.Router();
router.get('/', postController_1.postControllerExports.getPost);
//to be protected routes
router.use(userHandlers_1.userHandlerExports.protect);
router.delete('/:postId', postController_1.postControllerExports.deletePost);
router.post('/', postController_1.postControllerExports.createPost);
router.get('/:id', postController_1.postControllerExports.getPost);
router.post('/like/:postId', postController_1.postControllerExports.likePost);
router.post('/unlike/:postId', postController_1.postControllerExports.unlikePost);
exports.postRoutesExports = {
    router: router,
};
