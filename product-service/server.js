// server.js
const express = require('express');
const bodyParser = require('body-parser');
const routes = require("./routes");
require('dotenv').config();

const app = express();

// Middleware
app.use(express.json());
app.use(bodyParser.json());

// Routes
app.use('/', routes);

// Запуск сервиса
app.listen(process.env.PORT, () => {
    console.log(`Product Service running on port ${process.env.PORT}`);
});
