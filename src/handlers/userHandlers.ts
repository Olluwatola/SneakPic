import jwt, { JwtPayload, VerifyErrors } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import User, { IUser, IUserModel } from '../models/userSchema';
import catchAsync from '../utils/catchAsync';
import AppError from '../utils/appError';

interface ImailQuery {
    email: string;
}

export interface AuthResult {
    foundUser: IUserModel | null;
    jwtDecodedToken: JwtPayload | null;
}

const getUsersByQuery = async (queryString: JSON) => {
    const doc = await User.find({ queryString });
    if (doc) {
        return doc;
    } else {
        return null;
    }
};

const getUserByEmail = async (
    mailQueryString: ImailQuery
): Promise<IUser | null> => {
    const doc = await User.findOne({ mailQueryString });
    if (doc) {
        return doc;
    } else {
        return null;
    }
};

const protect = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        //get  bearer

        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith('Bearer ')
        ) {
            const secretKey: string = process.env.JWT_SECRET as string;

            const jwtDecoded = jwt.verify(
                req.headers.authorization.slice(7),
                secretKey
            ) as JwtPayload;

            req.currentUser = await User.findById(jwtDecoded?.user_id.trim());

            next();
        } else {
            return next(
                new AppError(
                    'unauthorized, no bearer recognized. kindly login',
                    401
                )
            );
        }
    }
);
export const userHandlerExports = {
    getUsersByQuery,
    getUserByEmail,
    protect,
};
