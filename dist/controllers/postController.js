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
const getPost = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () { });
const deletePost = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    let postToBeDeleted = req.params.postId;
    let doc = yield postSchema_1.default.findOneAndUpdate({
        id: postToBeDeleted,
        author: (_b = (_a = req.getUserResult) === null || _a === void 0 ? void 0 : _a.foundUser) === null || _b === void 0 ? void 0 : _b.id,
    }, { status: 'deleted' }, { new: true })
        .exec()
        .then((post) => {
        if (post) {
            res.status(201).json({
                status: 'success',
                message: 'post deleted successfully.',
            });
        }
        else if (post == null) {
            res.status(404).json({
                status: 'error',
                message: 'Post not found or unauthorized',
            });
        }
    });
    console.log(postToBeDeleted, (_d = (_c = req.getUserResult) === null || _c === void 0 ? void 0 : _c.foundUser) === null || _d === void 0 ? void 0 : _d.id, doc);
});
const createPost = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _e, _f, _g, _h;
    try {
        // console.log(
        //     `this is the user ${JSON.stringify(
        //         req.getUserResult?.foundUser?.id
        //     )}`1
        //);
        if ((_f = (_e = req.getUserResult) === null || _e === void 0 ? void 0 : _e.foundUser) === null || _f === void 0 ? void 0 : _f.id) {
            const doc = yield postSchema_1.default.create({
                author: (_h = (_g = req.getUserResult) === null || _g === void 0 ? void 0 : _g.foundUser) === null || _h === void 0 ? void 0 : _h.id,
                caption: req.body.caption,
            });
            //if no user in the currentuser , return please login
            res.status(201).json({
                status: 'success',
                data: {
                    data: doc,
                }, //ok
            });
        }
        else {
            res.status(400).json({
                status: 'error',
                message: 'user not found, kindly login',
            });
        }
    }
    catch (error) {
        res.status(500).json({
            status: 'error',
            err: {
                message: 'an error has occured',
                error: error,
            },
        });
    }
});
exports.postControllerExports = {
    createPost,
    getPost,
    deletePost,
};
