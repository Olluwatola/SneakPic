import {Request, Response, NextFunction} from 'express';

type FunctionWithCatch = (
  arg0: Request,
  arg1: Response,
  arg2: NextFunction
) => Promise<void>;

const catchAsync = (fn: FunctionWithCatch) => {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };
};

export default catchAsync;
