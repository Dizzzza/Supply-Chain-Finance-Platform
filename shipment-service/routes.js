const express = require('express');
const router = express.Router();
const { Pool } = require('pg');

// Подключение к PostgreSQL
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASS,
    port: process.env.DB_PORT,
});

// Создание отправки
router.post('/shipments', async (req, res) => {
    const { productId, customerId, status } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO shipments (product_id, customer_id, status) VALUES ($1, $2, $3) RETURNING *',
            [productId, customerId, status]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to create shipment' });
    }
});

// Получение статуса отправки
router.get('/shipments/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('SELECT * FROM shipments WHERE id = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Shipment not found' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch shipment' });
    }
});

// Обновление статуса отправки
router.put('/shipments/:id', async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    try {
        const result = await pool.query(
            'UPDATE shipments SET status = $1 WHERE id = $2 RETURNING *',
            [status, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Shipment not found' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to update shipment' });
    }
});