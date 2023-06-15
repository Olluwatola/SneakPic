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
//to be protected routes
//make this into a summarised controller
// router.use((req: Request, res: Response, next: NextFunction) => {
//     let bearerTokenReport: boolean | string = userHandlerExports.getBearerToken(
//         req.headers.authorization as string
//     );
//     if (bearerTokenReport == false) {
//         res.status(401).json({
//             status: 'error',
//             message: 'You are unauthorized to perform such action',
//         });
//     } else {
//         req.userID = bearerTokenReport;
//         next();
//     }
// });
router.use((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let currentUser = 
    //if token expired , dont return user
    userHandlers_1.userHandlerExports.getUserFromBearerToken(req.headers.authorization);
    console.log('we about to assign the user to the eeq body');
    console.log(`this is the user gotten from middleware btw ${currentUser}`);
    req.currentUser = currentUser;
    next();
}));
router.post('/', postController_1.postControllerExports.createPost);
exports.postRoutesExports = {
    router: router,
};
