import jwt from 'jsonwebtoken';
console.log('entered authmidlewareeeeeeeeeeeeeeeeeee');
const authenticateUser = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>
    if (!token)
        return res.status(401).json({ message: 'Unauthorized' });
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err)
            return res.status(403).json({ message: 'Invalid or expired token' });
        const { userId, role } = decoded;
        req.userId = userId;
        req.role = role;
        next();
    });
};
export default authenticateUser;
