import { IUserModel } from '../models/userSchema';
import { AuthResult } from './handlers/userHandlers';
declare global {
    declare namespace Express {
        export interface Request {
            currentUser?: IUserModel;
            getUserResult?: AuthResult;
        }
    }
}
