"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
router.use((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.headers.authorization) {
        let reqHeadersAuthorization = req.headers.authorization;
        let getUserResult = yield userHandlers_1.userHandlerExports.getUserFromBearerToken(reqHeadersAuthorization);
        if (getUserResult == false) {
            console.log(`hmmm token exp`);
            res.status(401).json({
                status: 'error',
                message: 'login token expired , kindly relogin',
            });
        }
        else {
            req.getUserResult = getUserResult;
            next();
        }
    }
    else {
        res.status(401).json({
            status: 'error',
            message: 'unauthorized, kindly login',
        });
    }
}));
router.delete('/:postId', postController_1.postControllerExports.deletePost);
router.post('/', postController_1.postControllerExports.createPost);
router.post('/like/:postId', postController_1.postControllerExports.likePost);
router.post('/unlike/:postId', postController_1.postControllerExports.unlikePost);
exports.postRoutesExports = {
    router: router,
};
