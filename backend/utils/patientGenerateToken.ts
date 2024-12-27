import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { Response } from 'express';

dotenv.config();

// Generate Patient Access Token
const generatePatientAccessToken = (userId: string, role: string): string => {
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) throw new Error('JWT_SECRET is not defined in the environment variables');

    return jwt.sign({ userId, role }, jwtSecret, { expiresIn: '15m' }); // Short-lived token (30 minutes)
};

// Generate Patient Refresh Token
const generatePatientRefreshToken = (res: Response, userId: string, role: string): void => {
    const jwtRefreshSecret = process.env.JWT_REFRESH_SECRET;
    if (!jwtRefreshSecret) throw new Error('JWT_REFRESH_SECRET is not defined in the environment variables');

    const refreshToken = jwt.sign({ userId, role }, jwtRefreshSecret, { expiresIn: '7d' }); // Long-lived token (7 days)

    console.log(refreshToken, 'Refresh token generated for patient');
    res.cookie('patientRefreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // Secure cookies in production
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
};

export { generatePatientAccessToken, generatePatientRefreshToken };
