// mailer.js
const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
    service: 'Gmail', // или другой сервис
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

const sendVerificationEmail = async (email, token) => {
    const verificationLink = `${process.env.BASE_URL}/verify-email?token=${token}`;
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Verify your email',
        text: `Please click the following link to verify your email: ${verificationLink}`,
        html: `<p>Please click the following link to verify your email: <a href="${verificationLink}">${verificationLink}</a></p>`,
    };

    await transporter.sendMail(mailOptions);
};

const sendPasswordResetEmail = async (email, token) => {
    const resetLink = `${process.env.BASE_URL}/reset-password?token=${token}`;
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Password Reset',
        text: `Please click the following link to reset your password: ${resetLink}`,
        html: `<p>Please click the following link to reset your password: <a href="${resetLink}">${resetLink}</a></p>`,
    };

    await transporter.sendMail(mailOptions);
};

module.exports = { sendVerificationEmail, sendPasswordResetEmail };