import jwt, { JwtPayload } from 'jsonwebtoken';
import User, { IUser, IUserModel } from '../models/userSchema';
const { promisify } = require('util');

interface ImailQuery {
    email: string;
}

export interface AuthResult {
    foundUser: IUserModel | null;
    jwtDecodedToken: JwtPayload | null;
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

const getUserFromBearerToken = async (
  reqHeadersAuthorization: string
): Promise<AuthResult | null | Error | undefined | boolean> => {
  const authHeader = reqHeadersAuthorization;
  const secretKey: string = process.env.JWT_SECRET as string;
  let foundUser: IUserModel | null = null;
  let jwtDecodedToken: JwtPayload | null = null;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.slice(7);

    try {
      jwtDecodedToken = jwt.verify(token, secretKey) as JwtPayload;
      const userID: string = jwtDecodedToken.user_id;

      foundUser = await User.findById(userID.trim());

      return { foundUser, jwtDecodedToken };
    } catch (err: any) {
      if (err.name === 'TokenExpiredError') {
        return false;
      } else {
        throw err;
      }
    }
  } else {
    console.log(`there is no bearer`);
  }
  
  return null;
};


export const userHandlerExports = {
    getUsersByQuery,
    getUserByEmail,
    getBearerToken,
    getUserFromBearerToken,
};
