import express, { NextFunction, Request, Response } from 'express';
import User, { IUser, IUserModel } from '../models/userSchema';
import MailVerification, {
    IMailVerification,
    IMailVerificationModel,
} from '../models/mailVerificationSchema';
import { emailValidatorExports } from '../utils/emailValidator';
import { randomAlphaNumericGeneratorExports } from '../utils/randomAlphaNumericGenerator';
import { mailerExports } from '../utils/mailer';
import { authHandlerExports } from '../handlers/authHandlers';

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
                        console.log(user);
                        authHandlerExports.sendJwtToCookie(
                            user,
                            req,
                            res,
                            next
                        );

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
                        //authHandlersExports.sendToken(user, 200, req, res);
                        //console.log('token sent');
                        //I cant figure out a way to create jwt token , because i need user Id , but on user creation
                        //i dont think the id is instantly done
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
                        return next(
                            new Error(
                                `an error occured while creating verification document ${error}`
                            )
                        );
                    });
            })
            .catch((error) => {
                console.log(error);
                console.log(process.env.MAILERMAIL, process.env.MAILERPASS);

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

const login = async (req: Request, res: Response, next: NextFunction) => {
    try {
        //check if the user submitted mail AND password
        //check if user exists on database
        //check if password matches

        const { email, password } = req.body;

        if (!email || !password) {
            return next(new Error('Please provide email and password'));
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
                return next(new Error('Incorrect email or password'));
            }
            authHandlerExports.sendJwtToCookie(foundUser, req, res, next);
        }
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: `AN ERROR OCCURED ${error}`,
        });
    }
};

export const authControllerExports = {
    signUp,
    requestMailVerificationCode,
    login,
};

// exclude password from displaying when u request user - checkkinngg.....
//rearrange the requestver cotrller - done
