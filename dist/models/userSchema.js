"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const UserSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    username: {
        type: String,
        unique: true,
        required: true
    },
    phone: {
        type: Number,
        unique: true
    },
    role: {
        type: String,
        required: true,
        enum: ['admin', 'unverified-user', 'verified-user'],
        default: 'unverified-user'
    },
    DOB: {
        type: Date
    },
    isActive: {
        type: Boolean,
        default: true,
        required: true
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: 8,
        select: false,
        //add more checks to the password, make it stronger
    },
    passwordConfirm: {
        type: String,
        required: [true, 'Please confirm your password'],
        // validate: {
        // // This only works on CREATE and SAVE!!!
        // validator: function(el:string) {
        //     return el === this.password;
        // },
        // message: 'Passwords are not the same!'
        // }
    },
});
//try to check if the mail has the structure of mails
// use nodemailer to verify mail
//make sure password and passwordConfirm match
//encrypt password 
//make sure passwordConfirm does not stay on the database
exports.default = mongoose_1.default.model('User', UserSchema);
