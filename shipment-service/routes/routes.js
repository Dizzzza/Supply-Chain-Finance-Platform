const express = require('express');
const router = express.Router();
const contract = require('../models/contract'); // Исправлено опечатку в имени файла
const service = require('../models/service'); // Импортируем функции для работы с базой данных
const authMiddleware = require('../middleware/jwtMiddleware'); // Импорт middleware

// Создание компании
router.post('/createCompany', authMiddleware, async (req, res) => {
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
router.post('/createSupplier', authMiddleware, async (req, res) => {
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
router.post('/createShipment', authMiddleware, async (req, res) => {
    const { companyId, supplierId, fiatAmount, status, handler, name, description } = req.body;
    try {
        const shipment = await service.createShipment(companyId, supplierId, fiatAmount, status, handler, name, description);
        res.status(201).json({ success: true, data: shipment });
    } catch (err) {
        console.error('Error in createShipment:', err);
        res.status(500).json({ success: false, error: 'Failed to create shipment' });
    }
});

// Создание транзакции
router.post('/createTransaction', authMiddleware, async (req, res) => {
    const { shipmentId, blockchainTxId, trxAmount, usdtAmount } = req.body;
    try {
        const result = await service.createTransaction(shipmentId, blockchainTxId, trxAmount, usdtAmount);
        res.status(201).json(result);
    } catch (err) {
        console.error('❌ Ошибка в createTransaction:', err);
        res.status(400).json({ 
            success: false, 
            error: err.message || 'Ошибка при создании транзакции' 
        });
    }
});

// Создание отправки (старый метод)
router.post('/registerShipment', authMiddleware, async (req, res) => {
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

// Получение информации поставки из блокчейна
router.get('/getShipmentBlockchain/:shipmentUuid', async (req, res) => {
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

// Получение всей информации о поставке
router.get('/getShipment/:shipmentID', authMiddleware, async (req, res) => {
    const shipmentID = req.params.shipmentID;
    try {
        const result = await service.getShipment(shipmentID);
        res.status(200).json(result);
    } catch (err) {
        console.error('Error in getShipment:', err);
        res.status(500).json({ error: 'Failed to fetch shipment' });
    }
});

// Проверка кошелька поставщика
router.get('/checkSupplierWallet/:supplierID', authMiddleware, async (req, res) => {
    const supplierID = req.params.supplierID;
    try {
        const result = await service.checkSupplierWallet(supplierID);
        res.status(200).json(result);
    } catch (err) {
        console.error('Error in checkSupplierWallet:', err);
        res.status(500).json({ error: 'Failed to fetch supplier wallet' });
    }
});

router.get('/getShipments', authMiddleware, async (req, res) => {
    try {
        // Извлечение параметров из query
        const { type, id, ...filters } = req.query;

        // Проверка наличия обязательных параметров
        if (!type || !id) {
            return res.status(400).json({ error: 'Missing required parameters: type and id' });
        }

        // Преобразование id в число
        const parsedId = parseInt(id, 10);
        if (isNaN(parsedId)) {
            return res.status(400).json({ error: 'Invalid id. Must be a number.' });
        }

        // Преобразование временных фильтров в объект Date
        const parsedFilters = {};
        if (filters.created_after) parsedFilters.created_after = new Date(filters.created_after);
        if (filters.created_before) parsedFilters.created_before = new Date(filters.created_before);
        if (filters.updated_after) parsedFilters.updated_after = new Date(filters.updated_after);
        if (filters.updated_before) parsedFilters.updated_before = new Date(filters.updated_before);
        if (filters.status) parsedFilters.status = filters.status;
        if (filters.handler) parsedFilters.handler = filters.handler;

        // Вызов функции getShipments
        const shipments = await service.getShipments(type, parsedId, parsedFilters);

        // Если данные найдены, отправляем их
        if (shipments.length > 0) {
            res.status(200).json(shipments);
        } else {
            res.status(404).json({ error: 'No shipments found for the given parameters' });
        }
    } catch (error) {
        console.error('Error in /getShipments:', error.message);
        res.status(500).json({ error: 'Failed to fetch shipments' });
    }
});

// Обновление статуса отправки
router.post('/updateStatus', authMiddleware, async (req, res) => {
    const { shipmentUuid, status, handler } = req.body;
    let amountInSun;
    if (status == "Delivered" && handler == "Retailer") {
        const amount = await service.getAmountByUuid(shipmentUuid);
        amountInSun = amount * 1e6;
    }
    console.log(amountInSun);
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
router.post('/processPayment', authMiddleware, async (req, res) => {
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

router.get('/getEntities', authMiddleware, async (req, res) => {
    try {
        const data = await service.getCompaniesAndSuppliers();
        res.status(200).json({ success: true, data });
    } catch (err) {
        console.error('Error in getCompaniesAndSuppliers:', err);
        res.status(500).json({ success: false, error: 'Failed to fetch companies and suppliers' });
    }
});

router.get('/getEntitiesForShipment', authMiddleware, async (req, res) => {
    try {
        const data = await service.getCompaniesAndSuppliersForShipment();
        res.status(200).json({ success: true, data });
    } catch (err) {
        console.error('Error in getCompaniesAndSuppliers:', err);
        res.status(500).json({ success: false, error: 'Failed to fetch companies and suppliers' });
    }
});

router.post('/createEntity', authMiddleware, async (req, res) => {
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

router.get('/getEntityData', authMiddleware, async (req, res) => {
    const { type, entityId } = req.query; // Используем req.query для получения параметров

    try {
        // Получаем данные с помощью универсальной функции
        const entity = await service.getEntityData(type, entityId);

        if (entity.error) {
            return res.status(400).json({ success: false, error: entity.error }); // Если произошла ошибка при получении данных
        }

        res.status(200).json({ success: true, data: entity }); // Успешный ответ
    } catch (err) {
        console.error('Error in getEntityData:', err.message); // Логируем сообщение об ошибке
        res.status(500).json({ success: false, error: 'Failed to fetch entity data' }); // Ответ с ошибкой сервера
    }
});

router.post('/addSupplierWallet', authMiddleware, async (req, res) => {
    const { supplierID, walletAddress } = req.body;

    try {
        // Создаем запись с помощью универсальной функции
        const entity = await service.updateSupplierWallet(supplierID, walletAddress);
        res.status(201).json({ success: true, data: entity });
    } catch (err) {
        console.error('Error in createEntity:', err);
        res.status(400).json({ success: false, error: err.message || 'Failed to create entity' });
    }
});

module.exports = router;