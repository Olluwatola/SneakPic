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
exports.userControllerExports = void 0;
const userSchema_1 = __importDefault(require("../models/userSchema"));
const getUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const doc = yield userSchema_1.default.findById(req.params.id);
        if (!doc) {
            return next(new Error('there is no user with such an ID'));
        }
        res.status(200).json({
            status: 'success',
            data: {
                data: doc,
            },
        });
    }
    catch (error) {
        res.status(500).json({
            status: 'error',
            err: {
                message: error,
            },
        });
    }
});
//WHO TF SEARCHES BY MAIL????
// const getUserByEmail = async (
//     req: Request,
//     res: Response,
//     next: NextFunction
// ) => {
//     try {
//         let doc: Promise<IUser | null>;
//         if (req.query.email) {
//             doc = userHandlerExports.getUserByEmail({
//                 email: req.query.email as string,
//             });
//         } else {
//             return next(new Error('kindly input a valid email to get User'));
//         }
//         if (!doc) {
//             return next(new Error('there is no user with such an email'));
//         }
//         res.status(200).json({
//             status: 'success',
//             data: {
//                 data: doc,
//             },
//         });
//     } catch (error) {
//         res.status(500).json({
//             status: 'error',
//             err: {
//                 message: error,
//             },
//         });
//     }
// };
const getAllUsers = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const doc = yield userSchema_1.default.find();
        if (!doc) {
            return next(new Error('there are not user that match such query'));
        }
        res.status(200).json({
            status: 'success',
            data: {
                data: doc,
            },
        });
    }
    catch (error) {
        res.status(500).json({
            status: 'error',
            err: {
                message: error,
            },
        });
    }
});
exports.userControllerExports = {
    getUser,
    getAllUsers,
    //getUserByEmail
};
// exclude password from displaying when u request user - checkkinngg.....
//rearrange the requestver cotrller - done
