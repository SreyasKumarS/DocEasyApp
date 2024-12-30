import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface AuthenticatedRequest extends Request {
    userId?: string;
    role?: string;
}


const authenticateUser = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>


    if (!token) return res.status(401).json({ message: 'Unauthorized' });

    jwt.verify(token, process.env.JWT_SECRET as string, (err, decoded) => {
        if (err) return res.status(403).json({ message: 'Invalid or expired token' });

        const { userId, role } = decoded as { userId: string; role: string };
        req.userId = userId;
        req.role = role;
        next();
    });
};

export default authenticateUser;
