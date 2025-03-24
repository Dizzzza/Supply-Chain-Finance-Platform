const pool = require('./db'); // Импортируем настроенный пул подключений
const contract = require('../models/cotract'); // Исправлено опечатку в имени файла
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');

// Функция для создания компании
async function createCompany(name, description) {
    const query = `
        INSERT INTO companies (name, description)
        VALUES ($1, $2)
        RETURNING *;
    `;
    try {
        const result = await pool.query(query, [name, description]);
        return result.rows[0]; // Возвращаем созданную запись
    } catch (error) {
        console.error('Error creating company:', error);
        throw error;
    }
}

// Функция для создания поставщика
async function createSupplier(name, description) {
    const query = `
        INSERT INTO suppliers (name, description)
        VALUES ($1, $2)
        RETURNING *;
    `;
    try {
        const result = await pool.query(query, [name, description]);
        return result.rows[0]; // Возвращаем созданную запись
    } catch (error) {
        console.error('Error creating supplier:', error);
        throw error;
    }
}

// Функция для создания отправки
async function createShipment(companyId, supplierId, fiatAmount, fiatCurrency, cryptoAmount, status, handler, name, description) {
    const shipmentUuid = uuidv4(); // Генерация UUID

    try {
        // Получение wallet_address из таблицы suppliers
        const supplierQuery = `
            SELECT wallet_address FROM suppliers WHERE id = $1;
        `;
        const supplierResult = await pool.query(supplierQuery, [supplierId]);
        if (supplierResult.rows.length === 0) {
            throw new Error('Supplier not found');
        }
        const deliveryWallet = supplierResult.rows[0].wallet_address;

        // Вставка данных в таблицу shipments
        const query = `
            INSERT INTO shipments (uuid, company_id, supplier_id, fiat_amount, fiat_currency, crypto_amount, status, handler, name, description)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
            RETURNING *;
        `;
        const result = await pool.query(query, [
            shipmentUuid,
            companyId,
            supplierId,
            fiatAmount,
            fiatCurrency,
            cryptoAmount,
            status,
            handler,
            name,
            description
        ]);
        const createdShipment = result.rows[0];

        // Вызов смарт-контракта для регистрации отправления
        const contractResult = await contract.registerShipment(shipmentUuid, deliveryWallet);
        if (!contractResult.success) {
            throw new Error('Failed to register shipment in the smart contract');
        }

        // Генерация JWT токена
        const token = jwt.sign(
            { shipmentUuid, companyId, supplierId },
            process.env.JWT_SECRET
        );

        // Возвращаем результат с токеном
        return {
            ...createdShipment,
            token,
            message: 'Shipment created and registered successfully',
        };
    } catch (error) {
        console.error('Error creating shipment:', error);
        throw error;
    }
}

// Функция для создания транзакции
async function createTransaction(shipmentId, amount, currency, blockchainTxId, status, blockchainId, tokenId) {
    const query = `
        INSERT INTO transactions (shipment_id, amount, currency, blockchain_tx_id, status, blockchain_id, token_id)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *;
    `;
    try {
        const result = await pool.query(query, [
            shipmentId,
            amount,
            currency,
            blockchainTxId,
            status,
            blockchainId,
            tokenId
        ]);
        return result.rows[0]; // Возвращаем созданную запись
    } catch (error) {
        console.error('Error creating transaction:', error);
        throw error;
    }
}

async function getCompaniesAndSuppliers() {
    const companiesQuery = `
        SELECT id, name FROM companies;
    `;
    const suppliersQuery = `
        SELECT id, name FROM suppliers;
    `;

    try {
        // Выполняем запросы к базе данных
        const companiesResult = await pool.query(companiesQuery);
        const suppliersResult = await pool.query(suppliersQuery);

        // Формируем результат в требуемом формате
        const result = {
            suppliers: suppliersResult.rows.map(row => ({
                id: row.id,
                name: row.name
            })),
            companies: companiesResult.rows.map(row => ({
                id: row.id,
                name: row.name
            }))
        };

        return result;
    } catch (error) {
        console.error('Error fetching companies and suppliers:', error);
        throw error;
    }
}

async function createEntity(type, name, description = null) {
    // Проверяем допустимость типа
    if (type !== 'company' && type !== 'supplier') {
        throw new Error('Invalid type. Type must be "company" or "supplier".');
    }

    // Определяем таблицу и запрос на основе типа
    const table = type === 'company' ? 'companies' : 'suppliers';
    const query = `
        INSERT INTO ${table} (name, description)
        VALUES ($1, $2)
        RETURNING *;
    `;

    try {
        // Выполняем запрос к базе данных
        const result = await pool.query(query, [name, description]);
        return result.rows[0]; // Возвращаем созданную запись
    } catch (error) {
        console.error(`Error creating ${type}:`, error);
        throw error;
    }
}

async function revokeToken(token) {
    try {
        // Декодирование токена для получения времени истечения
        const decoded = jwt.decode(token);
        const expiresAt = new Date(decoded.exp * 1000); // Преобразуем секунды в миллисекунды

        // Добавление токена в черный список
        await pool.query(
            'INSERT INTO token_blacklist (token, expires_at) VALUES ($1, $2)',
            [token, expiresAt]
        );
    } catch (error) {
        console.error('Error revoking token:', error);
        throw error;
    }
}

module.exports = {
    createCompany,
    createSupplier,
    createShipment,
    createTransaction,
    getCompaniesAndSuppliers,
    createEntity,
    revokeToken
};