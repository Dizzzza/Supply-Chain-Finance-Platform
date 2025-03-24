const pool = require('./db'); // Импортируем настроенный пул подключений

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
    const query = `
        INSERT INTO shipments (uuid, company_id, supplier_id, fiat_amount, fiat_currency, crypto_amount, status, handler, name, description)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        RETURNING *;
    `;
    try {
        const result = await pool.query(query, [
            shipmentUuid, // Вставляем сгенерированный UUID
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
        return result.rows[0]; // Возвращаем созданную запись
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

module.exports = {
    createCompany,
    createSupplier,
    createShipment,
    createTransaction,
    getCompaniesAndSuppliers,
    createEntity
};