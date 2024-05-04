import express, { NextFunction, Request, Response } from 'express';
import { IUser, IUserModel } from '../models/userSchema';
import { postControllerExports } from './../controllers/postController';
import { userHandlerExports } from './../handlers/userHandlers';
const router = express.Router();

router.get('/', postControllerExports.getPost);

//to be protected routes

router.use(userHandlerExports.protect);

router.delete('/:postId', postControllerExports.deletePost);
router.post('/', postControllerExports.createPost);
router.get('/:id', postControllerExports.getPost);
router.post('/like/:postId', postControllerExports.likePost);
router.post('/unlike/:postId', postControllerExports.unlikePost);


export const postRoutesExports = {
    router: router,
};
