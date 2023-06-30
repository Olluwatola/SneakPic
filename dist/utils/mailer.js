"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mailerExports = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const transporter = nodemailer_1.default.createTransport({
    service: 'gmail',
    auth: {
        // user: 'sneakpmail@gmail.com',
        // pass: 'lqxbjktjuqqvxvab'
        user: process.env.MAILER_MAIL,
        pass: process.env.MAILER_PASS
    }
});
exports.mailerExports = {
    transporter,
};
