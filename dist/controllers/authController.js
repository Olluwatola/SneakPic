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
exports.authControllerExports = void 0;
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const userSchema_1 = __importDefault(require("../models/userSchema"));
const mailVerificationSchema_1 = __importDefault(require("../models/mailVerificationSchema"));
const appError_1 = __importDefault(require("../utils/appError"));
const emailValidator_1 = require("../utils/emailValidator");
const randomAlphaNumericGenerator_1 = require("../utils/randomAlphaNumericGenerator");
const mailer_1 = require("../utils/mailer");
const authHandlers_1 = require("../handlers/authHandlers");
const signUp = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (emailValidator_1.emailValidatorExports.isValidEmail(req.body.email) == false) {
        return next(new appError_1.default('The email inputted seems to not be a valid email, retry !', 422));
    }
    yield mailVerificationSchema_1.default.findOne({ email: req.body.email }).then((mailVer) => __awaiter(void 0, void 0, void 0, function* () {
        if ((mailVer === null || mailVer === void 0 ? void 0 : mailVer.mailVerificationCode) ==
            req.body.mailVerificationCode) {
            //console.log('creating user');
            yield userSchema_1.default.create({
                name: req.body.name,
                email: req.body.email,
                username: req.body.username,
                phone: req.body.phone,
                DOB: req.body.DOB,
                password: req.body.password,
                passwordConfirm: req.body.passwordConfirm,
            }).then((user) => __awaiter(void 0, void 0, void 0, function* () {
                //console.log(user);
                authHandlers_1.authHandlerExports.sendJwtToCookie(user, req, res, next);
                // delete mail verification document from db
                yield mailVerificationSchema_1.default.findOneAndRemove({
                    email: req.body.email,
                });
            }));
        }
        else {
            return next(new appError_1.default('recheck code inputed', 422));
        }
    }));
}));
const requestMailVerificationCode = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    //generate random code
    const codeGenerated = randomAlphaNumericGenerator_1.randomAlphaNumericGeneratorExports.generateCode();
    const mailOptions = {
        from: 'sneakpmail@gmail.com',
        to: req.body.email,
        subject: 'Email Verification',
        text: `input the following code to verify your mail ${codeGenerated}`,
    };
    mailer_1.mailerExports.transporter.sendMail(mailOptions).then((info) => __awaiter(void 0, void 0, void 0, function* () {
        yield mailVerificationSchema_1.default.create({
            email: req.body.email,
            mailVerificationCode: codeGenerated,
        }).then(() => {
            // console.log('mail verification document created');
            // console.log('Email sent: ' + info.response);
            res.status(201).json({
                status: 'success',
                message: `kindly check you mail, to check the verification mail sent`,
            });
        });
    }));
}));
const login = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    //check if the user submitted mail AND password
    //check if user exists on database
    //check if password matches
    const { email, password } = req.body;
    if (!email || !password) {
        return next(new appError_1.default('Please provide email and password', 422));
    }
    else {
        //check if user exists
        const foundUser = yield userSchema_1.default.findOne({ email: email })
            .select('+password')
            .exec();
        //index email field in database
        if (!foundUser ||
            !(yield foundUser.correctPassword(password, foundUser.password))) {
            return next(new appError_1.default('Incorrect email or password', 422));
        }
        authHandlers_1.authHandlerExports.sendJwtToCookie(foundUser, req, res, next);
    }
}));
exports.authControllerExports = {
    signUp,
    requestMailVerificationCode,
    login,
};
