const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');

const app = express();

// Настройка CORS
app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Прокси для shipment-service на порт 3001
app.use('/ship', createProxyMiddleware({
    target: 'http://localhost:3001',
    changeOrigin: true,
    pathRewrite: {
        '^/ship': '', // убираем префикс /ship при переадресации
    },
    onError: (err, req, res) => {
        console.error('Proxy Error:', err);
        res.status(500).json({ error: 'Proxy Error', message: 'Service Unavailable' });
    }
}));

// Прокси для auth-service на порт 3002
app.use('/auth', createProxyMiddleware({
    target: 'http://localhost:3002',
    changeOrigin: true,
    pathRewrite: {
        '^/auth': '', // убираем префикс /auth при переадресации
    },
    onError: (err, req, res) => {
        console.error('Proxy Error:', err);
        res.status(500).json({ error: 'Proxy Error', message: 'Service Unavailable' });
    }
}));

// Обработка ошибок
app.use((err, req, res, next) => {
    console.error('Gateway Error:', err);
    res.status(500).json({ error: 'Gateway Error', message: 'Internal Server Error' });
});

// Запускаем api-gateway на порту 3003
app.listen(3003, () => {
    console.log('API Gateway запущен на http://localhost:3003');
});
