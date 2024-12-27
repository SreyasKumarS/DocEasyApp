import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { Response } from 'express';

dotenv.config();

// Function to generate the access token
const generateAdminAccessToken = (adminId: string): string => {
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) throw new Error('JWT_SECRET is not defined in the environment variables');
    return jwt.sign({ userId: adminId, role: 'admin' }, jwtSecret, { expiresIn: '15m' }); // Short-lived token
};

// Function to generate and store the refresh token in a cookie
const generateAdminRefreshToken = (res: Response, adminId: string): void => {
    const jwtRefreshSecret = process.env.JWT_REFRESH_SECRET;
    if (!jwtRefreshSecret) throw new Error('JWT_REFRESH_SECRET is not defined in the environment variables');

    const refreshToken = jwt.sign({ userId: adminId, role: 'admin' }, jwtRefreshSecret, { expiresIn: '7d' }); // Long-lived token

    console.log(refreshToken, 'Admin refresh token generated');

    res.cookie('adminRefreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
};

export { generateAdminAccessToken, generateAdminRefreshToken };



