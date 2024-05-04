import { NextFunction, Request, Response } from 'express';
import Post, { IPostModel } from '../models/postSchema';
import AppError from '../utils/appError';
import catchAsync from '../utils/catchAsync';
import PostLikeSchema from '../models/PostLikeSchema';

const getPost = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        await Post.findById(req.params.id)
            .populate('author')
            .select('-__v')
            .exec()
            .then(async (post) => {
                if (!post || post.status === 'deleted') {
                    return next(new AppError('post not found ', 404));
                }
                res.status(201).json({
                    status: 'success',
                    doc: post,
                });
            });
    }
);

const deletePost = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        await Post.findById(req.params.postId).then(async (post) => {
            if (!post || post.status === 'deleted') {
                return next(new AppError('post not found ', 404));
            }
            if (post.author !== req.currentUser?.id) {
                return next(new AppError('unauthorized ', 401));
            }
            await Post.findOneAndUpdate(
                {
                    _id: post.id,
                },
                { status: 'deleted' },
                { new: true, runValidators: true }
            ).then((post) => {
                if (!post) {
                    return next(new AppError('post not found ', 404));
                }
                res.status(201).json({
                    status: 'success',
                    message: 'post deleted successfully.',
                });
            });
        });
    }
);

const createPost = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const doc = await Post.create({
            author: req.currentUser?.id,
            caption: req.body.caption,
        });
        res.status(201).json({
            status: 'success',
            data: {
                data: doc,
            },
        });
    }
);

const likePost = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        //check if the post to be liked exists or has been deleted
        (await Post.findById(req.params.postId).then((post) => {
            if (!post || post.status == 'deleted') {
                return next(new AppError('post not found ', 404));
            }
        })) as IPostModel;

        // Check if the user already liked the post
        //we do this by trying to add the PostLike document, and allow the compound index throw
        //an error if the PostLike document exists already
        //we handle the error in error handle mw

        //create the PostLike document
        PostLikeSchema.create({
            user: req.currentUser?.id,
            postId: req.params.postId,
        })
            .then(async () => {
                //update the likesCount field
                const likes = await PostLikeSchema.find({
                    postId: req.params.postId,
                });

                await Post.findByIdAndUpdate(req.params.postId, {
                    likesCount: likes.length,
                });

                res.status(200).json({
                    status: 'success',
                    message: 'post successfully liked',
                });
            })
            .catch((err) => {
                return next(err);
            });

        //console.log('successfully updated post');
    }
);

const unlikePost = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        //check if the post to be liked exists or has been deleted
        (await Post.findById(req.params.postId).then((post) => {
            if (!post || post.status == 'deleted') {
                return next(new AppError('post not found ', 404));
            }
        })) as IPostModel;
        // remove the document
        await PostLikeSchema.findOneAndDelete({
            user: req.currentUser?.id,
            postId: req.params.postId,
        })
            .then(async (postlike) => {
                // if the returned doc is nul, that means the user never liked the post
                if (postlike === null) {
                    return next(
                        new AppError(
                            'you cannot unlike post you have not liked ',
                            404
                        )
                    );
                }
                //update the likesCount field
                const likes = await PostLikeSchema.find({
                    postId: req.params.postId,
                });

                await Post.findByIdAndUpdate(req.params.postId, {
                    likesCount: likes.length,
                });

                res.status(200).json({
                    status: 'success',
                    message: 'post successfully unliked',
                });
            })
            .catch((err) => {
                return next(err);
            });
        //if document doesnt exist it throws error to be handled in error handling mw
    }
);

export const postControllerExports = {
    createPost,
    getPost,
    deletePost,
    likePost,
    unlikePost,
};
