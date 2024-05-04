import { MongoAPIError, MongoError } from 'mongodb';
import AppError from './../utils/appError';
import { Request, Response, NextFunction } from 'express';

const handleCastErrorDB = (err: AppError) => {
    const message = `Invalid ${err.path}: ${err.value}.`;
    return new AppError(message, 400);
};

//dont use regex
// const handleDuplicateFieldsDB = (err: AppError) => {
//     const value = err.errmsg?.match(/(["'])(\\?.)*?\1/)![0];

//     const message = `Duplicate field value: ${value}. Please use another value!`;
//     return new AppError(message, 400);
// };

const handleDuplicatePostLikeError = () => {
    return new AppError('you cannot like a post more than once', 409);
};

const handleValidationErrorDB = (err: AppError) => {
    const errors = Object.values(err).map((el) => el.message);

    const message = `Invalid input data. ${errors.join('. ')}`;
    return new AppError(message, 400);
};

const handleJWTError = () =>
    new AppError('Invalid token. Please log in again!', 401);

const handleJWTExpiredError = () =>
    new AppError('Your token has expired! Please log in again.', 401);

const sendErrorDev = (err: AppError, req: Request, res: Response) => {
    return res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack,
    });
};

const sendErrorProd = (err: AppError, req: Request, res: Response) => {
    // A) Operational, trusted error: send message to client
    if (err.isOperational) {
        console.log(err);
        return res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
        });
    }
    // B) Programming or other unknown error: don't leak error details
    // 1) Log error
    console.error('ERROR 💥', err);
    // 2) Send generic message
    return res.status(500).json({
        status: 'error',
        message: 'Something went very wrong!',
    });
};

export default function errorController(
    err: AppError,
    req: Request,
    res: Response,
    next: NextFunction
) {
    // console.log(err.stack);

    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if (process.env.NODE_ENV === 'development') {
        sendErrorDev(err, req, res);
    }
    // else if (process.env.NODE_ENV === 'production') {
    //     let error: AppError = { ...err };
    //     error.message = err.message;

    //     if (error.name === 'CastError') error = handleCastErrorDB(error);
    //     if (error.code === 11000) error = handleDuplicateFieldsDB(error); // handler not fixed yet
    // if (
    //     error.code === 11000 &&
    //     error.keyPattern &&
    //     error.keyPattern.user === 1 &&
    //     error.keyPattern.postId === 1
    // ) {
    //     handleDuplicatePostLikeError();
    // }
    //     if (error.name === 'ValidationError')
    //         error = handleValidationErrorDB(error);
    //     if (error.name === 'JsonWebTokenError') error = handleJWTError();
    //     if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();

    //     sendErrorProd(error, req, res);
    // }
}
