import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { Response } from 'express';

dotenv.config();


const generateDoctorAccessToken = (userId: string, role: string): string => {
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) throw new Error('JWT_SECRET is not defined in the environment variables');
    return jwt.sign({ userId, role }, jwtSecret, { expiresIn: '15m' }); // Short-lived token
};

const generateDoctorRefreshToken = (res: Response, userId: string, role: string): void => {
    const jwtRefreshSecret = process.env.JWT_REFRESH_SECRET;
    if (!jwtRefreshSecret) throw new Error('JWT_REFRESH_SECRET is not defined in the environment variables');

    const refreshToken = jwt.sign({ userId, role }, jwtRefreshSecret, { expiresIn: '7d' }); // Long-lived token
    console.log(refreshToken,'refresh token from genarte refrsh tokennnnnnnnnnnnnnnnnnnnnnnn')
    res.cookie('doctorRefreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
};

export { generateDoctorAccessToken, generateDoctorRefreshToken };
