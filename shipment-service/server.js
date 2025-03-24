// server.js
const express = require('express');
const bodyParser = require('body-parser');
const routes = require("./routes/routes");
require('dotenv').config();

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(express.json());
app.use('/', routes);

// Запуск сервиса
app.listen(process.env.PORT, () => {
    console.log(`Shipment Service running on port ${process.env.PORT}`);
});
