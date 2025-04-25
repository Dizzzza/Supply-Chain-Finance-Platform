const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../models/db');
const { getEntities, addEntity } = require('../models/shipmentService');
const router = express.Router();
const { sendVerificationEmail } = require('../models/mailer');
const { sendPasswordResetEmail } = require('../models/mailer');

// Регистрация пользователя
router.post('/register', async (req, res) => {
    try {
        const { username, password, role, entityName, description, email } = req.body;

        // Проверка ввода
        if (!['company', 'supplier'].includes(role)) {
            return res.status(400).json({ message: 'Invalid role' });
        }

        // Получение списка компаний и поставщиков
        const entities = await getEntities();
        const entityType = role === 'company' ? 'companies' : 'suppliers';

        // Поиск существующей компании/поставщика
        let entity = entities[entityType].find(e => e.name === entityName);

        // Если компания/поставщик не найдены, создаем нового
        if (!entity) {
            console.log('Creating new entity with description:', description);
            const newEntity = await addEntity(role, entityName, description); // Передаем description
            entity = { id: newEntity.data.id, name: newEntity.data.name };
        }
        console.log('Entity:', entity);

        // Проверка, существует ли пользователь
        const userExists = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
        if (userExists.rows.length > 0) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Хеширование пароля
        const hashedPassword = await bcrypt.hash(password, 10);

        // Генерация токена верификации без срока действия
        const verificationToken = jwt.sign(
            { email },
            process.env.JWT_SECRET
            // Убираем опцию expiresIn, чтобы токен не имел срока действия
        );

        // Создание пользователя
        const newUser = await pool.query(
            'INSERT INTO users (username, password_hash, email, verification_token) VALUES ($1, $2, $3, $4) RETURNING *',
            [username, hashedPassword, email, verificationToken]
        );

        // Сохранение роли пользователя
        await pool.query(
            'INSERT INTO user_roles (user_id, role_type, entity_id) VALUES ($1, $2, $3)',
            [newUser.rows[0].id, role, entity.id]
        );

        // Отправка письма с подтверждением
        await sendVerificationEmail(email, verificationToken);

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Верификация пользователя
router.get('/verify-email', async (req, res) => {
    try {
        const { token } = req.query;

        // Проверка токена
        let decoded;
        try {
            // Отключаем проверку срока действия токена
            decoded = jwt.verify(token, process.env.JWT_SECRET, { ignoreExpiration: true });
        } catch (err) {
            return res.status(400).json({ message: 'Недействительный токен' });
        }

        // Поиск пользователя по токену
        const userResult = await pool.query('SELECT * FROM users WHERE verification_token = $1', [token]);
        const user = userResult.rows[0];
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Обновление статуса верификации
        await pool.query(
            'UPDATE users SET is_verified = TRUE, verification_token = NULL WHERE id = $1',
            [user.id]
        );

        // Проверяем обновление
        const updatedUser = await pool.query('SELECT * FROM users WHERE id = $1', [user.id]);
        console.log('User after verification:', {
            username: updatedUser.rows[0].username,
            is_verified: updatedUser.rows[0].is_verified,
            has_verification_token: !!updatedUser.rows[0].verification_token
        });

        res.status(200).json({ message: 'Email verified successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Поиск пользователя
        const userResult = await pool.query(
            'SELECT id, username, password_hash, email, is_verified, verification_token FROM users WHERE username = $1',
            [username]
        );
        const user = userResult.rows[0];
        console.log('Login attempt for user:', {
            username,
            found: !!user,
            is_verified: user?.is_verified,
            has_verification_token: !!user?.verification_token
        });
        
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Проверка пароля
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Проверка верификации email
        if (!user.is_verified) {
            return res.status(403).json({ 
                message: 'Please verify your email before logging in',
                needsVerification: true 
            });
        }

        // Получение данных из user_roles
        const roleResult = await pool.query(
            'SELECT role_type, entity_id FROM user_roles WHERE user_id = $1',
            [user.id]
        );
        const role = roleResult.rows[0];
        if (!role) {
            return res.status(400).json({ message: 'User role not found' });
        }

        // Генерация JWT с данными пользователя и роли
        const token = jwt.sign(
            {
                user_id: user.id,
                username: user.username,
                role_type: role.role_type,
                entity_id: role.entity_id
            },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.json({ message: 'Login successful', token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Смена пароля
router.post('/request-password-reset', async (req, res) => {
    try {
        const { email } = req.body;

        // Поиск пользователя по email
        const userResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        const user = userResult.rows[0];
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Генерация токена для сброса пароля
        const resetToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Сохранение токена в базу данных
        await pool.query(
            'UPDATE users SET verification_token = $1 WHERE id = $2',
            [resetToken, user.id]
        );

        // Отправка письма с ссылкой на сброс пароля
        await sendPasswordResetEmail(email, resetToken);

        res.status(200).json({ message: 'Password reset email sent. Please check your inbox.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.post('/reset-password', async (req, res) => {
    try {
        const { token, newPassword } = req.body;

        // Проверка токена
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (err) {
            return res.status(400).json({ message: 'Invalid or expired token' });
        }

        const userId = decoded.id;

        // Поиск пользователя по ID
        const userResult = await pool.query('SELECT * FROM users WHERE id = $1 AND verification_token = $2', [userId, token]);
        const user = userResult.rows[0];
        if (!user) {
            return res.status(404).json({ message: 'User not found or invalid token' });
        }

        // Хеширование нового пароля
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);

        // Обновление пароля и очистка токена
        await pool.query(
            'UPDATE users SET password_hash = $1, verification_token = NULL WHERE id = $2',
            [hashedNewPassword, userId]
        );

        res.status(200).json({ message: 'Password reset successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;