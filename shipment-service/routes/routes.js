const express = require('express');
const router = express.Router();
const contract = require('../models/cotract'); // Исправлено опечатку в имени файла
const service = require('../models/service'); // Импортируем функции для работы с базой данных

// Создание компании
router.post('/createCompany', async (req, res) => {
    const { name, description } = req.body;
    try {
        const company = await service.createCompany(name, description);
        res.status(201).json({ success: true, data: company });
    } catch (err) {
        console.error('Error in createCompany:', err);
        res.status(500).json({ success: false, error: 'Failed to create company' });
    }
});

// Создание поставщика
router.post('/createSupplier', async (req, res) => {
    const { name, description } = req.body;
    try {
        const supplier = await service.createSupplier(name, description);
        res.status(201).json({ success: true, data: supplier });
    } catch (err) {
        console.error('Error in createSupplier:', err);
        res.status(500).json({ success: false, error: 'Failed to create supplier' });
    }
});

// Создание отправки
router.post('/createShipment', async (req, res) => {
    const { companyId, supplierId, fiatAmount, fiatCurrency, cryptoAmount, status, handler, name, description } = req.body;
    try {
        const shipment = await service.createShipment(companyId, supplierId, fiatAmount, fiatCurrency, cryptoAmount, status, handler, name, description);
        res.status(201).json({ success: true, data: shipment });
    } catch (err) {
        console.error('Error in createShipment:', err);
        res.status(500).json({ success: false, error: 'Failed to create shipment' });
    }
});

// Создание транзакции
router.post('/createTransaction', async (req, res) => {
    const { shipmentId, amount, currency, blockchainTxId, status, blockchainId, tokenId } = req.body;
    try {
        const transaction = await service.createTransaction(shipmentId, amount, currency, blockchainTxId, status, blockchainId, tokenId);
        res.status(201).json({ success: true, data: transaction });
    } catch (err) {
        console.error('Error in createTransaction:', err);
        res.status(500).json({ success: false, error: 'Failed to create transaction' });
    }
});

// Создание отправки (старый метод)
router.post('/registerShipment', async (req, res) => {
    const { uuid, deliveryWallet } = req.body; // Изменено на deliveryWallet
    try {
        const result = await contract.registerShipment(uuid, deliveryWallet);
        if (result.success) {
            res.status(200).json(result);
        } else {
            res.status(400).json(result); // Более точный статус для ошибки
        }
    } catch (err) {
        console.error('Error in registerShipment:', err);
        res.status(500).json({ error: 'Failed to create shipment' });
    }
});

// Получение статуса отправки
router.get('/getShipment/:shipmentUuid', async (req, res) => {
    const shipmentUuid = req.params.shipmentUuid;
    try {
        const result = await contract.getShipment(shipmentUuid);
        if (result.success) {
            res.status(200).json(result);
        } else {
            res.status(404).json(result); // Более точный статус для отсутствующей поставки
        }
    } catch (err) {
        console.error('Error in getShipment:', err);
        res.status(500).json({ error: 'Failed to fetch shipment' });
    }
});

// Обновление статуса отправки
router.post('/updateStatus', async (req, res) => {
    const { shipmentUuid, status, handler, amountInSun } = req.body;
    try {
        const result = await contract.updateStatus(shipmentUuid, status, handler, amountInSun || 0);
        if (result.success) {
            res.status(200).json(result);
        } else {
            res.status(400).json(result); // Более точный статус для ошибки
        }
    } catch (err) {
        console.error('Error in updateStatus:', err);
        res.status(500).json({ error: 'Failed to update shipment' });
    }
});

// Обработка платежа
router.post('/processPayment', async (req, res) => {
    const { transactionHash, shipmentUuid } = req.body;
    try {
        const result = await contract.processPayment(transactionHash, shipmentUuid);
        if (result.success) {
            res.status(200).json(result);
        } else {
            res.status(400).json(result); // Более точный статус для ошибки
        }
    } catch (err) {
        console.error('Error in processPayment:', err);
        res.status(500).json({ error: 'Failed to process payment' });
    }
});

router.get('/getEntities', async (req, res) => {
    try {
        const data = await service.getCompaniesAndSuppliers();
        res.status(200).json({ success: true, data });
    } catch (err) {
        console.error('Error in getCompaniesAndSuppliers:', err);
        res.status(500).json({ success: false, error: 'Failed to fetch companies and suppliers' });
    }
});

router.post('/createEntity', async (req, res) => {
    const { type, name, description } = req.body;

    try {
        // Создаем запись с помощью универсальной функции
        const entity = await service.createEntity(type, name, description);
        res.status(201).json({ success: true, data: entity });
    } catch (err) {
        console.error('Error in createEntity:', err);
        res.status(400).json({ success: false, error: err.message || 'Failed to create entity' });
    }
});

module.exports = router;