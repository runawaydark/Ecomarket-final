import jwt from 'jsonwebtoken';
import User from '../models/user.js';

// Middleware base autentica al usuario y carga req.user
export const auth = async (req, res, next) => {
    try {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;

    if (!token) return res.status(401).json({ message: 'No autorizado' });

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(payload.sub);

    if (!user) return res.status(401).json({ message: 'No autorizado' });

    req.user = user;
    next();
    } catch (e) {
    return res.status(401).json({ message: 'Token inválido' });
    }
};

// Alias por compatibilidad 
export const requireAuth = auth;

// Middleware que exige rol ADMIN
export const requireAdmin = (req, res, next) => {
    const role = req.user?.role;
    const isAdmin = role === 'ADMIN' || role === 'admin';

    if (!isAdmin) {
    return res.status(403).json({ message: 'Requiere rol admin' });
    }
    next();
};


export const onlyAdmin = requireAdmin;
export default { auth, requireAuth, requireAdmin };
