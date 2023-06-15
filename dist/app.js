"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.appExports = void 0;
const express_1 = __importDefault(require("express"));
const userRoutes_1 = require("./routes/userRoutes");
const postRoutes_1 = require("./routes/postRoutes");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use('/api/v1/users', userRoutes_1.userRoutesExports.router);
app.use('/api/v1/posts', postRoutes_1.postRoutesExports.router);
exports.appExports = {
    app: app,
};
