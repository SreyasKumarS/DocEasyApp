import { Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { generateDoctorAccessToken } from '../utils/doctorGenerateToken.js';

const refreshAccessToken = (req: Request, res: Response) => {
    console.log('enetered refrsh token');
    
    const refreshToken = req.cookies.doctorRefreshToken;
    // console.log(refreshToken,'refreshToken received from cokies for rfrshtoken helperrrrrrrrrrrrrrrrrrrrrrrr');
    if (!refreshToken) return res.status(401).json({ message: 'Unauthorized' });

    const jwtRefreshSecret = process.env.JWT_REFRESH_SECRET;
    if (!jwtRefreshSecret) throw new Error('JWT_REFRESH_SECRET is not defined');

    jwt.verify(refreshToken, jwtRefreshSecret, (err: Error | null, decoded: JwtPayload | string | undefined) => {
        if (err) return res.status(403).json({ message: 'Invalid refresh token' });

        if (decoded && typeof decoded !== 'string') {
            const { userId, role } = decoded as JwtPayload & { userId: string; role: string };
            const newAccessToken = generateDoctorAccessToken(userId, role);
            return res.status(200).json({ accessToken: newAccessToken });
        }

        return res.status(403).json({ message: 'Invalid token payload' });
    });
};

export { refreshAccessToken };
