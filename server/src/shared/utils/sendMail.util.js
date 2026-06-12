// Importing modules
import logger from '../config/logger.config.js';
import transporter from '../config/mail.config.js';
import env from '../config/env.config.js';

// function to send the mail
async function sendMail(to, subject, html) {
    try {

        //making options 
        const mailOptions = {
            from: `GLPDDP <${env.TRANSACTIONAL_EMAIL}>`,
            to,
            subject,
            html
        };

        // sending the mail
        await transporter.sendMail(mailOptions);

    } catch (error) {
        logger.error({ error }, 'Error sending email:');
    }
}

export default sendMail;