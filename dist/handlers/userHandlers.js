"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userHandlerExports = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userSchema_1 = __importDefault(require("../models/userSchema"));
const { promisify } = require('util');
let getUsersByQuery = (queryString) => __awaiter(void 0, void 0, void 0, function* () {
    let doc = yield userSchema_1.default.find({ queryString });
    if (doc) {
        return doc;
    }
    else {
        return null;
    }
});
let getBearerToken = (reqHeadersAuthorization) => {
    const authHeader = reqHeadersAuthorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
        console.log(`this is the bearer ${authHeader} ${typeof authHeader}`);
        const token = authHeader.slice(7);
        return token;
    }
    else {
        return false;
    }
};
let getUserByEmail = (mailQueryString) => __awaiter(void 0, void 0, void 0, function* () {
    let doc = yield userSchema_1.default.findOne({ mailQueryString });
    if (doc) {
        return doc;
    }
    else {
        return null;
    }
});
const getUserFromBearerToken = (reqHeadersAuthorization) => __awaiter(void 0, void 0, void 0, function* () {
    const authHeader = reqHeadersAuthorization;
    const secretKey = process.env.JWT_SECRET;
    let foundUser = null;
    let jwtDecodedToken = null;
    if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.slice(7);
        try {
            jwtDecodedToken = jsonwebtoken_1.default.verify(token, secretKey);
            const userID = jwtDecodedToken.user_id;
            foundUser = yield userSchema_1.default.findById(userID.trim());
            return { foundUser, jwtDecodedToken };
        }
        catch (err) {
            if (err.name === 'TokenExpiredError') {
                return false;
            }
            else {
                throw err;
            }
        }
    }
    else {
        console.log(`there is no bearer`);
    }
    return null;
});
exports.userHandlerExports = {
    getUsersByQuery,
    getUserByEmail,
    getBearerToken,
    getUserFromBearerToken,
};
