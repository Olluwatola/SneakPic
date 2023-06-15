import express, { NextFunction, Request, Response } from 'express';
import Post, { IPost, IPostModel } from '../models/postSchema';

const createPost = async (req: Request, res: Response, next: NextFunction) => {
    try {
        console.log(`this is the user ${JSON.stringify(req.currentUser)}`);
        const doc = await Post.create({
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
    } catch (error: any) {
        res.status(500).json({
            status: 'error',
            err: {
                message: error,
            },
        });
    }
};

export const postControllerExports = {
    createPost,
};
