import express, { NextFunction, Request, Response } from 'express';
import User, { IUser, IUserModel } from '../models/userSchema';
import { userHandlerExports } from '../handlers/userHandlers';

const getUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const doc = await User.findById(req.params.id);
        if (!doc) {
            return next(new Error('there is no user with such an ID'));
        }

        res.status(200).json({
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

//WHO TF SEARCHES BY MAIL????

// const getUserByEmail = async (
//     req: Request,
//     res: Response,
//     next: NextFunction
// ) => {
//     try {
//         let doc: Promise<IUser | null>;
//         if (req.query.email) {
//             doc = userHandlerExports.getUserByEmail({
//                 email: req.query.email as string,
//             });
//         } else {
//             return next(new Error('kindly input a valid email to get User'));
//         }

//         if (!doc) {
//             return next(new Error('there is no user with such an email'));
//         }

//         res.status(200).json({
//             status: 'success',
//             data: {
//                 data: doc,
//             },
//         });
//     } catch (error) {
//         res.status(500).json({
//             status: 'error',
//             err: {
//                 message: error,
//             },
//         });
//     }
// };

const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const doc = await User.find();
        if (!doc) {
            return next(new Error('there are not user that match such query'));
        }

        res.status(200).json({
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

export const userControllerExports = {
    getUser,
    getAllUsers,
    //getUserByEmail
};

// exclude password from displaying when u request user - checkkinngg.....
//rearrange the requestver cotrller - done
