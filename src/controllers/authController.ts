import { NextFunction, Request, Response } from 'express';
import catchAsync from '../utils/catchAsync';
import User from '../models/userSchema';
import MailVerification from '../models/mailVerificationSchema';
import AppError from '../utils/appError';
import { emailValidatorExports } from '../utils/emailValidator';
import { randomAlphaNumericGeneratorExports } from '../utils/randomAlphaNumericGenerator';
import { mailerExports } from '../utils/mailer';
import { authHandlerExports } from '../handlers/authHandlers';

const signUp = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        if (emailValidatorExports.isValidEmail(req.body.email) == false) {
            return next(
                new AppError(
                    'The email inputted seems to not be a valid email, retry !',
                    422
                )
            );
        }

        await MailVerification.findOne({ email: req.body.email }).then(
            async (mailVer) => {
                if (
                    mailVer?.mailVerificationCode ==
                    req.body.mailVerificationCode
                ) {
                    //console.log('creating user');
                    await User.create({
                        name: req.body.name,
                        email: req.body.email,
                        username: req.body.username,
                        phone: req.body.phone,
                        DOB: req.body.DOB,
                        password: req.body.password,
                        passwordConfirm: req.body.passwordConfirm,
                    }).then(async (user) => {
                        //console.log(user);
                        authHandlerExports.sendJwtToCookie(
                            user,
                            req,
                            res,
                            next
                        );

                        // delete mail verification document from db
                        await MailVerification.findOneAndRemove({
                            email: req.body.email,
                        });
                    });
                } else {
                    return next(new AppError('recheck code inputed', 422));
                }
            }
        );
    }
);

const requestMailVerificationCode = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        //generate random code
        const codeGenerated: string =
            randomAlphaNumericGeneratorExports.generateCode();

        const mailOptions = {
            from: 'sneakpmail@gmail.com',
            to: req.body.email,
            subject: 'Email Verification',
            text: `input the following code to verify your mail ${codeGenerated}`,
        };

        mailerExports.transporter.sendMail(mailOptions).then(async (info) => {
            await MailVerification.create({
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
        });
    }
);

const login = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        //check if the user submitted mail AND password
        //check if user exists on database
        //check if password matches

        const { email, password } = req.body;

        if (!email || !password) {
            return next(new AppError('Please provide email and password', 422));
        } else {
            //check if user exists
            const foundUser = await User.findOne({ email: email })
                .select('+password')
                .exec();
            //index email field in database

            if (
                !foundUser ||
                !(await foundUser.correctPassword(password, foundUser.password))
            ) {
                return next(new AppError('Incorrect email or password', 422));
            }
            authHandlerExports.sendJwtToCookie(foundUser, req, res, next);
        }
    }
);

export const authControllerExports = {
    signUp,
    requestMailVerificationCode,
    login,
};
