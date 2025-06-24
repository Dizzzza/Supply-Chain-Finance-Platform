// server.js
const express = require('express');
const bodyParser = require('body-parser');
const routes = require("./routes/routes");
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors({
    origin: 'http://localhost:3000', // Разрешаем запросы только с нашего React приложения
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Разрешенные методы
    allowedHeaders: ['Content-Type', 'Authorization'] // Разрешенные заголовки
}));
app.use(bodyParser.json());
app.use(express.json());
app.use('/', routes);

// Запуск сервиса
app.listen(process.env.PORT, () => {
    console.log(`Shipment Service running on port ${process.env.PORT}`);
});
