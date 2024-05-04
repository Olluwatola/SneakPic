import { NextFunction, Request, Response } from 'express';
import { IUserModel } from '../models/userSchema';
import jwt from 'jsonwebtoken';

let sendJwtToCookie = async (
    foundUser: IUserModel,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const payload = {
        user_id: foundUser.id,
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30, // Expiration time of 30 days
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET as string);

    res.cookie('jwt_token', token, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
    }).json({
        status: 'success',
        user: foundUser,
        message: 'access token sent',
    });
    //next();
};
export const authHandlerExports = {
    sendJwtToCookie,
};
