import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import User from '../models/User.js';
import { sendVerificationEmail } from '../config/mailer.js';

const generateToken = (res, userId) => {
    const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    });
    res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000
    });
};

export const registerUser = async (req, res) => {
    try {
        const { username, email, password, role } = req.body;
        
        // Basic validation
        if (!username || !email || !password || !role) {
            return res.status(400).json({ message: 'Please fill all fields' });
        }

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'A user with this email already exists.' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const verificationToken = crypto.randomUUID();

        await User.create({ 
            username, 
            email, 
            password: hashedPassword, 
            role,
            verificationToken 
        });

        // Send the verification email
        await sendVerificationEmail(email, verificationToken);
        
        res.status(201).json({
            message: 'Registration successful! Please check your email to verify your account.'
        });

    } catch (err) {
        console.error("Error in registerUser:", err);
        res.status(500).json({ message: "Server error during registration." });
    }
};

export const loginUser = async (req, res) => {
    try {
        const { email, password, role } = req.body;
        const user = await User.findOne({ email, role });
        
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: 'Invalid email or password.' });
        }
        
        if (!user.isVerified) {
            return res.status(403).json({ message: 'Please verify your email before logging in.' });
        }

        generateToken(res, user._id);
        
        // Send user data back, excluding sensitive fields
        res.json({ 
            user: { 
                id: user._id, 
                username: user.username, 
                email: user.email, 
                role: user.role, 
                avatarUrl: user.avatarUrl 
            } 
        });
    } catch (err) {
        console.error("Error in loginUser:", err);
        res.status(500).json({ message: "Server error during login." });
    }
};

export const verifyEmail = async (req, res) => {
    try {
        const { token } = req.body;
        if (!token) {
            return res.status(400).json({ message: 'Verification token is missing.' });
        }

        const user = await User.findOne({ verificationToken: token });
        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired verification token.' });
        }

        user.isVerified = true;
        user.verificationToken = undefined;
        await user.save();

        res.status(200).json({ message: 'Email verified successfully! You can now log in.' });
    } catch (err) {
        console.error("Error in verifyEmail:", err);
        res.status(500).json({ message: 'Server error during email verification.' });
    }
};

export const logoutUser = (req, res) => {
    res.cookie('token', '', { httpOnly: true, expires: new Date(0) });
    res.json({ message: 'Logged out' });
};

export const getMe = async (req, res) => {
    if (!req.user) return res.status(401).json({ message: 'Not authorized' });
    res.json(req.user);
};