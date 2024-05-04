class AppError extends Error {
    statusCode: number;
    isOperational: boolean;
    status: string;
    code?: number;
    errmsg?: string;
    errors?: Error[];
    path?: string;
    value?: string;

    constructor(message: string, statusCode: number) {
        console.log('3....')
        console.log(process.env.NODE_ENV )
        super(message);

        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor);
    }
}

export default AppError;
