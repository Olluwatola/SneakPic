import nodemailer from 'nodemailer';


const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.MAILER_MAIL,
        pass: process.env.MAILER_PASS
    }
});




export const mailerExports = {
    transporter,
}





