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
exports.authHandlerExports = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
let sendJwtToCookie = (foundUser, req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const payload = {
        user_id: foundUser.id,
        exp: Math.floor(Date.now() / 1000) + 60 * 30, // Expiration time of 30 minutes
    };
    const token = jsonwebtoken_1.default.sign(payload, process.env.JWT_SECRET);
    res.cookie('jwt_token', token, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
    }).json({
        status: 'success',
        message: 'LOGIN SUCCESSFUL',
    });
    next();
});
exports.authHandlerExports = {
    sendJwtToCookie,
};
