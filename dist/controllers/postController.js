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
const appError_1 = __importDefault(require("../utils/appError"));
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const PostLikeSchema_1 = __importDefault(require("../models/PostLikeSchema"));
const getPost = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    yield postSchema_1.default.findById(req.params.id)
        .populate('author')
        .select('-__v')
        .exec()
        .then((post) => __awaiter(void 0, void 0, void 0, function* () {
        if (!post || post.status === 'deleted') {
            return next(new appError_1.default('post not found ', 404));
        }
        res.status(201).json({
            status: 'success',
            doc: post,
        });
    }));
}));
const deletePost = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    yield postSchema_1.default.findById(req.params.postId).then((post) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        if (!post || post.status === 'deleted') {
            return next(new appError_1.default('post not found ', 404));
        }
        if (post.author !== ((_a = req.currentUser) === null || _a === void 0 ? void 0 : _a.id)) {
            return next(new appError_1.default('unauthorized ', 401));
        }
        yield postSchema_1.default.findOneAndUpdate({
            _id: post.id,
        }, { status: 'deleted' }, { new: true, runValidators: true }).then((post) => {
            if (!post) {
                return next(new appError_1.default('post not found ', 404));
            }
            res.status(201).json({
                status: 'success',
                message: 'post deleted successfully.',
            });
        });
    }));
}));
const createPost = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    const doc = yield postSchema_1.default.create({
        author: (_b = req.currentUser) === null || _b === void 0 ? void 0 : _b.id,
        caption: req.body.caption,
    });
    res.status(201).json({
        status: 'success',
        data: {
            data: doc,
        },
    });
}));
const likePost = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _c;
    //check if the post to be liked exists or has been deleted
    (yield postSchema_1.default.findById(req.params.postId).then((post) => {
        if (!post || post.status == 'deleted') {
            return next(new appError_1.default('post not found ', 404));
        }
    }));
    // Check if the user already liked the post
    //we do this by trying to add the PostLike document, and allow the compound index throw
    //an error if the PostLike document exists already
    //we handle the error in error handle mw
    //create the PostLike document
    PostLikeSchema_1.default.create({
        user: (_c = req.currentUser) === null || _c === void 0 ? void 0 : _c.id,
        postId: req.params.postId,
    })
        .then(() => __awaiter(void 0, void 0, void 0, function* () {
        //update the likesCount field
        const likes = yield PostLikeSchema_1.default.find({
            postId: req.params.postId,
        });
        yield postSchema_1.default.findByIdAndUpdate(req.params.postId, {
            likesCount: likes.length,
        });
        res.status(200).json({
            status: 'success',
            message: 'post successfully liked',
        });
    }))
        .catch((err) => {
        return next(err);
    });
    //console.log('successfully updated post');
}));
const unlikePost = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _d;
    //check if the post to be liked exists or has been deleted
    (yield postSchema_1.default.findById(req.params.postId).then((post) => {
        if (!post || post.status == 'deleted') {
            return next(new appError_1.default('post not found ', 404));
        }
    }));
    // remove the document
    yield PostLikeSchema_1.default.findOneAndDelete({
        user: (_d = req.currentUser) === null || _d === void 0 ? void 0 : _d.id,
        postId: req.params.postId,
    })
        .then((postlike) => __awaiter(void 0, void 0, void 0, function* () {
        // if the returned doc is nul, that means the user never liked the post
        if (postlike === null) {
            return next(new appError_1.default('you cannot unlike post you have not liked ', 404));
        }
        //update the likesCount field
        const likes = yield PostLikeSchema_1.default.find({
            postId: req.params.postId,
        });
        yield postSchema_1.default.findByIdAndUpdate(req.params.postId, {
            likesCount: likes.length,
        });
        res.status(200).json({
            status: 'success',
            message: 'post successfully unliked',
        });
    }))
        .catch((err) => {
        return next(err);
    });
    //if document doesnt exist it throws error to be handled in error handling mw
}));
exports.postControllerExports = {
    createPost,
    getPost,
    deletePost,
    likePost,
    unlikePost,
};
