import express, { NextFunction, Request, Response } from 'express';
import { IUser, IUserModel } from '../models/userSchema';
import { postControllerExports } from './../controllers/postController';
import { userHandlerExports } from './../handlers/userHandlers';
const router = express.Router();

//to be protected routes

//make this into a summarised controller
// router.use((req: Request, res: Response, next: NextFunction) => {
//     let bearerTokenReport: boolean | string = userHandlerExports.getBearerToken(
//         req.headers.authorization as string
//     );

//     if (bearerTokenReport == false) {
//         res.status(401).json({
//             status: 'error',
//             message: 'You are unauthorized to perform such action',
//         });
//     } else {
//         req.userID = bearerTokenReport;
//         next();
//     }
// });

router.use(async (req: Request, res: Response, next: NextFunction) => {
    let currentUser: Promise<IUserModel | boolean> =

    //if token expired , dont return user
        userHandlerExports.getUserFromBearerToken(
            req.headers.authorization as string
        ) as Promise<IUserModel>;

        console.log('we about to assign the user to the eeq body');
        console.log(`this is the user gotten from middleware btw ${currentUser}`)
        req.currentUser = currentUser;
        next();
    
});

router.post('/', postControllerExports.createPost);

export const postRoutesExports = {
    router: router,
};
