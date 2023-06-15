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
const userSchema_1 = __importDefault(require("../models/userSchema"));
const mailVerificationSchema_1 = __importDefault(require("../models/mailVerificationSchema"));
const emailValidator_1 = require("../utils/emailValidator");
const randomAlphaNumericGenerator_1 = require("../utils/randomAlphaNumericGenerator");
const mailer_1 = require("../utils/mailer");
const authHandlers_1 = require("../handlers/authHandlers");
const signUp = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    //res.send(req.body)
    try {
        const emailStringValidity = yield emailValidator_1.emailValidatorExports.isValidEmail(req.body.email);
        if (emailStringValidity == false) {
            throw Error('The email inputted does not look like a valid email, retry !');
        }
        yield mailVerificationSchema_1.default.findOne({ email: req.body.email }).then((mailVer) => __awaiter(void 0, void 0, void 0, function* () {
            if ((mailVer === null || mailVer === void 0 ? void 0 : mailVer.mailVerificationCode) ==
                req.body.mailVerificationCode) {
                console.log('creating user');
                yield userSchema_1.default.create({
                    name: req.body.name,
                    email: req.body.email,
                    username: req.body.username,
                    phone: req.body.phone,
                    //verificationStatus: req.body.verificationStatus,
                    //role: req.body.role,
                    DOB: req.body.DOB,
                    password: req.body.password,
                    passwordConfirm: req.body.passwordConfirm,
                }).then((user) => __awaiter(void 0, void 0, void 0, function* () {
                    // delete mail verification document from db
                    yield mailVerificationSchema_1.default.findOneAndRemove({
                        email: req.body.email,
                    })
                        .then(() => {
                        console.log(`email verification document has been deleted`);
                    })
                        .catch((err) => {
                        console.log(err);
                    });
                    //console.log(user)
                    //authHandlersExports.sendToken(user, 200, req, res);
                    //console.log('token sent');
                    res.status(201).json({
                        status: 'success',
                        message: `user successfully created`,
                        data: user,
                    });
                }));
            }
            else {
                res.status(500).json({
                    status: 'error',
                    message: `recheck the code inputed`,
                });
            }
        }));
    }
    catch (error) {
        //if (error.code === 11000) {
        //    error = 'A user with that email already exists';
        //}
        res.status(500).json({
            status: 'error',
            message: `AN ERROR OCCURED ${error}`,
        });
    }
    //console.log(req)
});
const requestMailVerificationCode = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //generate random code
        const codeGenerated = randomAlphaNumericGenerator_1.randomAlphaNumericGeneratorExports.generateCode();
        const mailOptions = {
            from: 'sneakpmail@gmail.com',
            to: req.body.email,
            subject: 'Email Verification',
            text: `input the following code to verify your mail ${codeGenerated}`,
        };
        mailer_1.mailerExports.transporter
            .sendMail(mailOptions)
            .then((info) => __awaiter(void 0, void 0, void 0, function* () {
            yield mailVerificationSchema_1.default.create({
                email: req.body.email,
                mailVerificationCode: codeGenerated,
            })
                .then((mailVer) => {
                console.log('mail verification document created');
                console.log('Email sent: ' + info.response);
                res.status(201).json({
                    status: 'success',
                    message: `kindly check you mail, to check the verification mail sent`,
                });
            })
                .catch((error) => {
                return next(new Error(`an error occured while creating verification document ${error}`));
            });
        }))
            .catch((error) => {
            throw Error(`error occured with creating mail verification code ${error}`);
        });
    }
    catch (error) {
        res.status(500).json({
            status: 'error',
            message: `AN ERROR OCCURED ${error}`,
        });
    }
});
const login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //check if the user submitted mail AND password
        //check if user exists on database
        //check if password matches
        const { email, password } = req.body;
        if (!email || !password) {
            return next(new Error('Please provide email and password'));
        }
        else {
            //check if user exists
            const foundUser = yield userSchema_1.default.findOne({ email: email })
                .select('+password')
                .exec();
            //index email field in database
            if (!foundUser ||
                !(yield foundUser.correctPassword(password, foundUser.password))) {
                return next(new Error('Incorrect email or password'));
            }
            authHandlers_1.authHandlerExports.sendJwtToCookie(foundUser, req, res, next);
        }
    }
    catch (error) {
        res.status(500).json({
            status: 'error',
            message: `AN ERROR OCCURED ${error}`,
        });
    }
});
exports.authControllerExports = {
    signUp,
    requestMailVerificationCode,
    login,
};
// exclude password from displaying when u request user - checkkinngg.....
//rearrange the requestver cotrller - done
