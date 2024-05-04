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
exports.userControllerExports = void 0;
const userSchema_1 = __importDefault(require("../models/userSchema"));
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const getUser = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const doc = yield userSchema_1.default.findById(req.params.id);
    if (!doc) {
        return next(new Error('there is no user with the provided ID'));
    }
    res.status(200).json({
        status: 'success',
        data: {
            data: doc,
        },
    });
}));
const getAllUsers = (0, catchAsync_1.default)((_req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const doc = yield userSchema_1.default.find();
    if (doc.length < 1) {
        return next(new Error('there is no user'));
    }
    res.status(200).json({
        status: 'success',
        data: {
            data: doc,
        },
    });
}));
exports.userControllerExports = {
    getUser,
    getAllUsers,
};
