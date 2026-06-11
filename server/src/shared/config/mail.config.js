// Importing modules
import nodemailer from 'nodemailer';
import env from './env.config.js';

// transporter for sending the mails
const transporter = nodemailer.createTransport({
    host: env.SMTP_SERVICE,
    port: env.SMTP_PORT,
    auth: {
        user: env.SMTP_USER,
        pass: env.SMTP_PASS
    },
});

export default transporter;