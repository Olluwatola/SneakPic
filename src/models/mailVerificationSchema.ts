import mongoose, { Document, Schema } from 'mongoose';


export interface IMailVerification {
    email: String;
    mailVerificationCode:String;
    }

export interface IMailVerificationModel extends IMailVerification, Document {}

const MailVerificationSchema: Schema = new Schema({
    email: {
        type: String,
        unique: true,
        required:true
    },
    mailVerificationCode: {
        type: String,
        unique:true,
        required:true,
    }
})


export default mongoose.model<IMailVerificationModel>('MailVerification', MailVerificationSchema);
