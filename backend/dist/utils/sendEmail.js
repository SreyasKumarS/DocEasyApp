import nodemailer from 'nodemailer';
const sendEmail = async (to, subject, text) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.MAIL_PASSWORD,
            },
        });
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to,
            subject,
            text,
        });
    }
    catch (error) {
        console.error('Email sending failed:', error);
        throw new Error('Email sending failed');
    }
};
export default sendEmail;
