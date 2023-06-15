import jwt, { JwtPayload } from 'jsonwebtoken';
import User, { IUser, IUserModel } from '../models/userSchema';
const { promisify } = require('util');

interface ImailQuery {
    email: string;
}

let getUsersByQuery = async (queryString: JSON) => {
    let doc = await User.find({ queryString });
    if (doc) {
        return doc;
    } else {
        return null;
    }
};

let getBearerToken = (reqHeadersAuthorization: string) => {
    const authHeader = reqHeadersAuthorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
        console.log(`this is the bearer ${authHeader} ${typeof authHeader}`);
        const token = authHeader.slice(7);
        return token;
    } else {
        return false;
    }
};

let getUserByEmail = async (
    mailQueryString: ImailQuery
): Promise<IUser | null> => {
    let doc = await User.findOne({ mailQueryString });
    if (doc) {
        return doc;
    } else {
        return null;
    }
};

let getUserFromBearerToken = async (
    reqHeadersAuthorization: string
): Promise<IUserModel | null | Error | undefined | boolean> => {
    const authHeader = reqHeadersAuthorization;
    const secretKey: string = process.env.JWT_SECRET as string;
    let foundUser: IUserModel | null;
    console.log(authHeader);
    if (authHeader && authHeader.startsWith('Bearer ')) {
        console.log(`this is the bearer ${authHeader} ${typeof authHeader}`);
        const token = authHeader.slice(7);
        try {
            console.log(`this is the token ${token}`);
            console.log('ok okokokokok');

            let foundUser = await promisify(jwt.verify)(
                token,
                process.env.JWT_SECRET
            )
                .then(async (jwtDecodedToken: JwtPayload) => {
                    const userID: String = jwtDecodedToken.user_id;
                    // console.log(
                    //     `this is the decoded token ${JSON.stringify(decodedToken)}`
                    // );
                    console.log(`this is the id ${userID}`);
                    foundUser = await User.findById(userID.trim());
                    console.log(`this is the foundUser ${foundUser}`);

                    return foundUser;
                })
                .catch((err: any) => {
                    throw err
                });
                return foundUser;
        } catch (err: any) {
            //console.log(err.stack)
            if (err.stack.includes('TokenExpiredError: jwt expired')) {
                return false;
            }
        }
    } else {
        console.log(`theree is no bearer`);
    }
};

export const userHandlerExports = {
    getUsersByQuery,
    getUserByEmail,
    getBearerToken,
    getUserFromBearerToken,
};
