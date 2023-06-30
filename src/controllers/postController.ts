import express, { NextFunction, Request, Response } from 'express';
import Post, { IPost, IPostModel } from '../models/postSchema';
import { ObjectId } from 'mongodb';

const getPost = async (req: Request, res: Response, next: NextFunction) => {};

const deletePost = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let postToBeDeleted: string = req.params.postId;
        //console.log(req.params);
        await Post.findOneAndUpdate(
            {
                _id: postToBeDeleted,
                author: req.getUserResult?.foundUser?.id,
            },
            { status: 'deleted' },
            { new: true, runValidators: true }
        ).then((post) => {
            if (post) {
                res.status(201).json({
                    status: 'success',
                    message: 'post deleted successfully.',
                });
            } else if (post == null) {
                res.status(404).json({
                    status: 'error',
                    message: 'Post not found or unauthorized',
                });
            }
        });
    } catch (err) {
        res.status(500).json({
            status: 'error',
            message: 'an internal server error has occured',
        });
    }

    //console.log(postToBeDeleted, req.getUserResult?.foundUser?.id, doc);
};

const createPost = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (req.getUserResult?.foundUser?.id) {
            const doc = await Post.create({
                author: req.getUserResult?.foundUser?.id,
                caption: req.body.caption,
            });
            //if no user in the currentuser , return please login
            res.status(201).json({
                status: 'success',
                data: {
                    data: doc,
                }, //ok
            });
        } else {
            res.status(400).json({
                status: 'error',
                message: 'user not found, kindly login',
            });
        }
    } catch (error: any) {
        res.status(500).json({
            status: 'error',
            err: {
                message: 'an error has occured',
                error: error,
            },
        });
    }
};

const likePost = async (req: Request, res: Response, next: NextFunction) => {
    try {
        //check if the post to be liked exists or has been deleted
        let post: IPostModel = (await Post.findById(
            req.params.postId
        )) as IPostModel;
        if (!post || post.status == 'deleted') {
            return res.status(404).json({
                status: 'error',
                message: 'Post not found',
            });
        }

        // Check if the user already liked the post
        if (post.likes.includes(req.getUserResult?.foundUser?.id)) {
            return res.status(400).json({
                status: 'error',
                message: 'Post already liked by user',
            });
        }

        //add the user id to the likes array
        post.likes.push(new ObjectId(req.getUserResult?.foundUser?.id));

        //update the likesCount field
        await post.updateLikesCount();

        await post.save();

        console.log('successfully updated post');

        return res.status(200).json({
            status: 'success',
            message: 'post successfully liked by user',
            data: {
                data: post,
            },
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            status: 'error',
            err: {
                message: 'an error has occured',
                error: err,
            },
        });
    }
};

const unlikePost = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let post: IPostModel = (await Post.findById(
            req.params.postId
        )) as IPostModel;

        if (!post || post.status == 'deleted') {
            return res.status(404).json({
                status: 'error',
                message: 'Post not found',
            });
        }

        // Check if the user already liked the post
        if (!post.likes.includes(req.getUserResult?.foundUser?.id)) {
            return res.status(400).json({
                status: 'error',
                message: 'Post not liked by user',
            });
        }

        const indexToRemove: number = post.likes.indexOf(
            req.getUserResult?.foundUser?.id
        );

        // if (indexToRemove == -1) {
        //     return res.status(400).json({
        //         status: 'error',
        //         message: 'Post not liked by user',
        //     });
        // }

        if (indexToRemove !== -1) {
            post.likes.splice(indexToRemove, 1);
            await post.updateLikesCount();
            await post.save();
            return res.status(200).json({
                status: 'success',
                message: 'post successfully unliked by user',
                data: {
                    data: post,
                },
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: 'error',
            err: {
                message: 'an error has occured',
                error: error,
            },
        });
    }
};

export const postControllerExports = {
    createPost,
    getPost,
    deletePost,
    likePost,
    unlikePost,
};
