const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');

// Загрузка переменных окружения
dotenv.config();

// Инициализация приложения
const app = express();
app.use(bodyParser.json());

// Маршруты
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

// Защищенный маршрут
const authMiddleware = require('./middleware/authMiddleware');
app.get('/api/protected', authMiddleware, (req, res) => {
    res.json({ message: 'This is a protected route!', user: req.user });
});

// Запуск сервера
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});