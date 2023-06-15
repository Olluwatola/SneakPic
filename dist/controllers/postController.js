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
exports.postControllerExports = void 0;
const postSchema_1 = __importDefault(require("../models/postSchema"));
const createPost = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(`this is the user ${JSON.stringify(req.currentUser)}`);
        const doc = yield postSchema_1.default.create({
            author: req.currentUser.id,
            caption: req.body.caption,
        });
        //if no user in the currentuser , return please login
        res.status(201).json({
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
exports.postControllerExports = {
    createPost,
};
