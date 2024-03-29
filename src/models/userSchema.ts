import mongoose, { Document, Schema } from 'mongoose';
//const bcrypt = require('bcryptjs');
import bcrypt from 'bcrypt';

export interface IUser {
    name: string;
    email: string;
    username: string;
    phone: number;
    //verificationStatus: string;
    role: string;
    DOB: Date;
    isActive: boolean;
    password: string;
    passwordConfirm: string;
    correctPassword(
        candidatePassword: string,
        userPassword: string
    ): Promise<boolean>;
}

export interface IUserModel extends IUser, Document {}

const UserSchema: Schema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
    },
    username: {
        type: String,
        unique: true,
        required: true,
    },
    phone: {
        type: Number,
        unique: true,
    },
    role: {
        type: String,
        required: true,
        enum: ['admin', 'unverified-user', 'verified-user'],
        default: 'unverified-user',
    },
    DOB: {
        type: Date,
    },
    isActive: {
        type: Boolean,
        default: true,
        required: true,
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


// UserSchema.pre(/^find/, function (next) {
//     this.populate({
//         path: '',
//         select: '-__v -password ',
//     });

//     next();
// });
//pre hooks and post hooks
UserSchema.pre('save', async function (next) {
    // Only run this function if password was actually modified
    if (!this.isModified('password')) return next();

    // Hash the password with cost of 12
    this.password = await bcrypt.hash(this.password, 12);

    // Delete passwordConfirm field
    this.passwordConfirm = undefined;
    next();
});

//methods
UserSchema.methods.correctPassword = async function (
    candidatePassword:string,
    userPassword:string
) {
    return await bcrypt.compare(candidatePassword as string, userPassword);
};

//try to check if the mail has the structure of mails
// use nodemailer to verify mail
//make sure password and passwordConfirm match
//encrypt password
//make sure passwordConfirm does not stay on the database

export default mongoose.model<IUserModel>('User', UserSchema);
