import express, { NextFunction, Request, Response } from 'express';
import User, { IUser, IUserModel } from '../models/userSchema';

const getUser = async (req: Request, res: Response, next: NextFunction) => {};

export const userControllerExports = {
    getUser,
};

// exclude password from displaying when u request user - checkkinngg.....
//rearrange the requestver cotrller - done
