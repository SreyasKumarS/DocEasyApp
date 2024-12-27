import jwt from 'jsonwebtoken';
import { generateDoctorAccessToken } from '../utils/doctorGenerateToken.js';
const refreshAccessToken = (req, res) => {
    console.log('enetered refrsh token');
    const refreshToken = req.cookies.doctorRefreshToken;
    // console.log(refreshToken,'refreshToken received from cokies for rfrshtoken helperrrrrrrrrrrrrrrrrrrrrrrr');
    if (!refreshToken)
        return res.status(401).json({ message: 'Unauthorized' });
    const jwtRefreshSecret = process.env.JWT_REFRESH_SECRET;
    if (!jwtRefreshSecret)
        throw new Error('JWT_REFRESH_SECRET is not defined');
    jwt.verify(refreshToken, jwtRefreshSecret, (err, decoded) => {
        if (err)
            return res.status(403).json({ message: 'Invalid refresh token' });
        if (decoded && typeof decoded !== 'string') {
            const { userId, role } = decoded;
            console.log(userId, role, 'userid in refresh tkem helpoer got it');
            const newAccessToken = generateDoctorAccessToken(userId, role);
            console.log(newAccessToken, 'newAccessToken newwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww');
            return res.status(200).json({ accessToken: newAccessToken });
        }
        return res.status(403).json({ message: 'Invalid token payload' });
    });
};
export { refreshAccessToken };
