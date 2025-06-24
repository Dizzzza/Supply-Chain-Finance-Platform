const jwt = require('jsonwebtoken');
const pool = require('../models/db'); // Подключение к базе данных

async function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Authorization header missing or invalid' });
    }

    const token = authHeader.split(' ')[1];

    try {
        // Проверка, находится ли токен в черном списке
        const blacklistedToken = await pool.query('SELECT * FROM token_blacklist WHERE token = $1', [token]);
        if (blacklistedToken.rows.length > 0) {
            return res.status(401).json({ message: 'Token has been revoked' });
        }

        // Проверка подписи токена
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Добавление данных пользователя в запрос
        req.user = decoded;
        next();
    } catch (error) {
        console.error(error);
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
}

module.exports = authMiddleware;