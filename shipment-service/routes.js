const express = require('express');
const router = express.Router();
const contract = require('./contract')

// Создание отправки
router.post('/registerShipment', async (req, res) => {
    const { uuid, name, description } = req.body;
    try {
        const result = await contract.registerShipment(uuid, name, description);
        if(result.success) {
            res.status(200).json(result);
        } else {
            res.status(500).json(result);
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to create shipment' });
    }
});

// Получение статуса отправки
router.get('/getShipment/:shipmentUuid', async (req, res) => {
    const shipmentUuid = req.params.shipmentUuid;
    try {
        const result = await contract.getShipment(shipmentUuid);
        console.log(result  )
        if(result.success) {
            res.status(200).json(result);
        } else {
            res.status(500).json(result);
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch shipment' });
    }
});

// Обновление статуса отправки
router.post('/updateStatus', async (req, res) => {
    const { shipmentUuid, status, handler } = req.body;
    try {
        const result = await contract.updateStatus(shipmentUuid, status, handler);
        if(result.success) {
            res.status(200).json(result);
        } else {
            res.status(500).json(result);
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to update shipment' });
    }
});

router.post('/processPayment', async (req, res) => {
    const { transactionHash, shipmentUuid } = req.body;
    try {
        const result = await contract.processPayment(transactionHash, shipmentUuid);
        if(result.success) {
            res.status(200).json(result);
        } else {
            res.status(500).json(result);
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to update shipment' });
    }
});

module.exports = router;