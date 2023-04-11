import express, { NextFunction, Request, Response } from 'express';
import User, { IUser, IUserModel } from '../models/userSchema';
import MailVerification, {
    IMailVerification,
    IMailVerificationModel,
} from '../models/mailVerificationSchema';
import { emailValidatorExports } from '../utils/emailValidator';
import { randomAlphaNumericGeneratorExports } from '../utils/randomAlphaNumericGenerator';
import { mailerExports } from '../utils/mailer';

const signUp = async (req: Request, res: Response, next: NextFunction) => {
    //res.send(req.body)

    try {
        const emailStringValidity: boolean =
            await emailValidatorExports.isValidEmail(req.body.email);

        if (emailStringValidity == false) {
            throw Error(
                'The email inputted does not look like a valid email, retry !'
            );
        }

        await MailVerification.findOne({ email: req.body.email }).then(
            async (mailVer) => {
                if (
                    mailVer?.mailVerificationCode ==
                    req.body.mailVerificationCode
                ) {
                    console.log('creating user');
                    await User.create({
                        name: req.body.name,
                        email: req.body.email,
                        username: req.body.username,
                        phone: req.body.phone,
                        //verificationStatus: req.body.verificationStatus,
                        //role: req.body.role,
                        DOB: req.body.DOB,
                        password: req.body.password,
                        passwordConfirm: req.body.passwordConfirm,
                    }).then(async (user) => {
                        // delete mail verification document from db
                        await MailVerification.findOneAndRemove({
                            email: req.body.email,
                        })
                            .then(() => {
                                console.log(
                                    `email verification document has been deleted`
                                );
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
                    });
                } else {
                    res.status(500).json({
                        status: 'error',
                        message: `recheck the code inputed`,
                    });
                }
            }
        );
    } catch (error: any) {
        //if (error.code === 11000) {
        //    error = 'A user with that email already exists';
        //}

        res.status(500).json({
            status: 'error',
            message: `AN ERROR OCCURED ${error}`,
        });
    }
    //console.log(req)
};

const requestMailVerificationCode = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        //generate random code
        const codeGenerated: string =
            randomAlphaNumericGeneratorExports.generateCode();

        const mailOptions = {
            from: 'sneakpmail@gmail.com',
            to: req.body.email,
            subject: 'Email Verification',
            text: `input the following code to verify your mail ${codeGenerated}`,
        };

        mailerExports.transporter
            .sendMail(mailOptions)
            .then(async (info) => {
                await MailVerification.create({
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
                        throw Error(
                            `an error occured while creating verification document`
                        );
                    });
            })
            .catch((error) => {
                throw Error(
                    `error occured with creating mail verification code ${error}`
                );
            });
    } catch (error: any) {
        res.status(500).json({
            status: 'error',
            message: `AN ERROR OCCURED ${error}`,
        });
    }
};

export const authControllerExports = {
    signUp,
    requestMailVerificationCode,
};

// exclude password from displaying when u request user - checkkinngg.....
//rearrange the requestver cotrller - done
