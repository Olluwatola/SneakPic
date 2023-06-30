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
const mongodb_1 = require("mongodb");
const getPost = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () { });
const deletePost = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        let postToBeDeleted = req.params.postId;
        //console.log(req.params);
        yield postSchema_1.default.findOneAndUpdate({
            _id: postToBeDeleted,
            author: (_b = (_a = req.getUserResult) === null || _a === void 0 ? void 0 : _a.foundUser) === null || _b === void 0 ? void 0 : _b.id,
        }, { status: 'deleted' }, { new: true, runValidators: true }).then((post) => {
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
    }
    catch (err) {
        res.status(500).json({
            status: 'error',
            message: 'an internal server error has occured',
        });
    }
    //console.log(postToBeDeleted, req.getUserResult?.foundUser?.id, doc);
});
const createPost = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _c, _d, _e, _f;
    try {
        if ((_d = (_c = req.getUserResult) === null || _c === void 0 ? void 0 : _c.foundUser) === null || _d === void 0 ? void 0 : _d.id) {
            const doc = yield postSchema_1.default.create({
                author: (_f = (_e = req.getUserResult) === null || _e === void 0 ? void 0 : _e.foundUser) === null || _f === void 0 ? void 0 : _f.id,
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
const likePost = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _g, _h, _j, _k;
    try {
        //check if the post to be liked exists or has been deleted
        let post = (yield postSchema_1.default.findById(req.params.postId));
        if (!post || post.status == 'deleted') {
            return res.status(404).json({
                status: 'error',
                message: 'Post not found',
            });
        }
        // Check if the user already liked the post
        if (post.likes.includes((_h = (_g = req.getUserResult) === null || _g === void 0 ? void 0 : _g.foundUser) === null || _h === void 0 ? void 0 : _h.id)) {
            return res.status(400).json({
                status: 'error',
                message: 'Post already liked by user',
            });
        }
        //add the user id to the likes array
        post.likes.push(new mongodb_1.ObjectId((_k = (_j = req.getUserResult) === null || _j === void 0 ? void 0 : _j.foundUser) === null || _k === void 0 ? void 0 : _k.id));
        //update the likesCount field
        yield post.updateLikesCount();
        yield post.save();
        console.log('successfully updated post');
        return res.status(200).json({
            status: 'success',
            message: 'post successfully liked by user',
            data: {
                data: post,
            },
        });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            status: 'error',
            err: {
                message: 'an error has occured',
                error: err,
            },
        });
    }
});
const unlikePost = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _l, _m, _o, _p;
    try {
        let post = (yield postSchema_1.default.findById(req.params.postId));
        if (!post || post.status == 'deleted') {
            return res.status(404).json({
                status: 'error',
                message: 'Post not found',
            });
        }
        // Check if the user already liked the post
        if (!post.likes.includes((_m = (_l = req.getUserResult) === null || _l === void 0 ? void 0 : _l.foundUser) === null || _m === void 0 ? void 0 : _m.id)) {
            return res.status(400).json({
                status: 'error',
                message: 'Post not liked by user',
            });
        }
        const indexToRemove = post.likes.indexOf((_p = (_o = req.getUserResult) === null || _o === void 0 ? void 0 : _o.foundUser) === null || _p === void 0 ? void 0 : _p.id);
        // if (indexToRemove == -1) {
        //     return res.status(400).json({
        //         status: 'error',
        //         message: 'Post not liked by user',
        //     });
        // }
        if (indexToRemove !== -1) {
            post.likes.splice(indexToRemove, 1);
            yield post.updateLikesCount();
            yield post.save();
            return res.status(200).json({
                status: 'success',
                message: 'post successfully unliked by user',
                data: {
                    data: post,
                },
            });
        }
    }
    catch (error) {
        console.log(error);
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
    likePost,
    unlikePost,
};
