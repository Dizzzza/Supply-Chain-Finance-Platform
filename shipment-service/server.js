// server.js
const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(express.json());

// Запуск сервиса
app.listen(process.env.PORT, () => {
    console.log(`Shipment Service running on port ${process.env.PORT}`);
});
