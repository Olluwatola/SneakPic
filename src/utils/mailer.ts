import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'sneakpmail@gmail.com',
        pass: 'lqxbjktjuqqvxvab'
    }
});




export const mailerExports = {
    transporter,
}





