import express, { NextFunction, Request, Response } from 'express';
import User, { IUser, IUserModel } from '../models/userSchema';
import jwt from 'jsonwebtoken';

let sendJwtToCookie = async (
    foundUser: IUserModel,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const payload = {
        user_id: foundUser.id,
        exp: Math.floor(Date.now() / 1000) + 60 * 30, // Expiration time of 30 minutes
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET as string);

    res.cookie('jwt_token', token, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
    }).json({
        status: 'success',
        message: 'LOGIN SUCCESSFUL',
    });
    next();
};

export const authHandlerExports = {
    sendJwtToCookie,
};
