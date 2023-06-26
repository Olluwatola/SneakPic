import express, { NextFunction, Request, Response } from 'express';
import Post, { IPost, IPostModel } from '../models/postSchema';

const getPost = async (req: Request, res: Response, next: NextFunction) => {};

const deletePost = async (req: Request, res: Response, next: NextFunction) => {
    let postToBeDeleted: string = req.params.postId;
    let doc=await Post.findOneAndUpdate(
        {
            id: postToBeDeleted,
            author: req.getUserResult?.foundUser?.id,
        },
        { status: 'deleted' },
        { new: true }
    )
        .exec()
        .then((post) => {
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

    console.log(postToBeDeleted,req.getUserResult?.foundUser?.id,doc);
};

const createPost = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // console.log(
        //     `this is the user ${JSON.stringify(
        //         req.getUserResult?.foundUser?.id
        //     )}`1
        //);
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

export const postControllerExports = {
    createPost,
    getPost,
    deletePost,
};
