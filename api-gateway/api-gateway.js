const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

// Прокси для service-1 на порт 3001
app.use('/ship', createProxyMiddleware({
  target: 'http://localhost:3001',
  changeOrigin: true,
  pathRewrite: {
    '^/ship': '', // убираем префикс /service1 при переадресации
  },
}));

// Прокси для service-2 на порт 3002
app.use('/auth', createProxyMiddleware({
  target: 'http://localhost:3002',
  changeOrigin: true,
  pathRewrite: {
    '^/auth': '', // убираем префикс /service2 при переадресации
  },
}));

// Запускаем api-gateway на порту 3000
app.listen(3003, () => {
  console.log('API Gateway запущен на http://localhost:3003');
});
