import { NextFunction, Request, Response } from 'express';
import User from '../models/userSchema';
import catchAsync from '../utils/catchAsync';

const getUser = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const doc = await User.findById(req.params.id)
            
        if (!doc) {
            return next(new Error('there is no user with the provided ID'));
        }

        res.status(200).json({
            status: 'success',
            data: {
                data: doc,
            },
        });
    }
);

const getAllUsers = catchAsync(
    async (_req: Request, res: Response, next: NextFunction) => {
        const doc = await User.find();
        if (doc.length < 1) {
            return next(new Error('there is no user'));
        }

        res.status(200).json({
            status: 'success',
            data: {
                data: doc,
            },
        });
    }
);

export const userControllerExports = {
    getUser,
    getAllUsers,
};
