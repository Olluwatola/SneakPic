import { IUserModel } from '../models/userSchema';
declare global {
    declare namespace Express {
        export interface Request {
            currentUser?: IUserModel;
        }
    }
}
