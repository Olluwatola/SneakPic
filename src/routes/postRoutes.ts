import express, { NextFunction, Request, Response } from 'express';
import { IUser, IUserModel } from '../models/userSchema';
import { postControllerExports } from './../controllers/postController';
import { userHandlerExports, AuthResult } from './../handlers/userHandlers';
const router = express.Router();

router.get('/',postControllerExports.getPost)

//to be protected routes

router.use(async (req: Request, res: Response, next: NextFunction) => {
    if (req.headers.authorization) {
        let reqHeadersAuthorization: string = req.headers.authorization;

        let getUserResult: boolean | AuthResult | Error | null | undefined =
            await userHandlerExports.getUserFromBearerToken(
                reqHeadersAuthorization
            );

        if (getUserResult == false) {
            res.status(401).json({
                message: 'login token expired , kindly relogin',
            });
        } else {
            req.getUserResult = getUserResult as AuthResult;
            next();
        }
    }
});

router.delete('/:postId', postControllerExports.deletePost);
router.post('/', postControllerExports.createPost);

export const postRoutesExports = {
    router: router,
};
