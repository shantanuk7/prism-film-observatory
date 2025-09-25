import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Create a "transporter" object that knows how to send emails
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

/**
 * Sends a verification email to a new user.
 * @param {string} to - The recipient's email address.
 * @param {string} token - The unique verification token.
 */
export const sendVerificationEmail = async (to, token) => {
    const verificationUrl = `http://localhost:5173/verify-email?token=${token}`;

    const mailOptions = {
        from: `"Prism App" <${process.env.EMAIL_USER}>`,
        to: to,
        subject: 'Verify Your Prism Account',
        html: `
            <div style="font-family: Arial, sans-serif; line-height: 1.6;">
                <h2>Welcome to Prism!</h2>
                <p>Thank you for registering. Please click the link below to verify your email address:</p>
                <p>
                    <a href="${verificationUrl}" style="background-color: #0d9488; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
                        Verify My Account
                    </a>
                </p>
                <p>If you did not create an account, please ignore this email.</p>
            </div>
        `,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Verification email sent to ${to}`);
    } catch (error) {
        console.error(`Error sending email to ${to}:`, error);
        // In a production app, you might want to handle this error more gracefully
    }
};