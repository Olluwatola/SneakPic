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
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const appError_1 = __importDefault(require("../utils/appError"));
const getUsersByQuery = (queryString) => __awaiter(void 0, void 0, void 0, function* () {
    const doc = yield userSchema_1.default.find({ queryString });
    if (doc) {
        return doc;
    }
    else {
        return null;
    }
});
const getUserByEmail = (mailQueryString) => __awaiter(void 0, void 0, void 0, function* () {
    const doc = yield userSchema_1.default.findOne({ mailQueryString });
    if (doc) {
        return doc;
    }
    else {
        return null;
    }
});
const protect = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    //get  bearer
    if (req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer ')) {
        const secretKey = process.env.JWT_SECRET;
        const jwtDecoded = jsonwebtoken_1.default.verify(req.headers.authorization.slice(7), secretKey);
        req.currentUser = yield userSchema_1.default.findById(jwtDecoded === null || jwtDecoded === void 0 ? void 0 : jwtDecoded.user_id.trim());
        next();
    }
    else {
        return next(new appError_1.default('unauthorized, no bearer recognized. kindly login', 401));
    }
}));
exports.userHandlerExports = {
    getUsersByQuery,
    getUserByEmail,
    protect,
};
