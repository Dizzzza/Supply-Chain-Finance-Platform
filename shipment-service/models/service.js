const pool = require('./db'); // Импортируем настроенный пул подключений
const contract = require('./contract'); // Исправлено опечатку в имени файла
const jwt = require('jsonwebtoken');
const TronWeb = require('tronweb');
const tronWeb = new TronWeb({ fullHost: 'https://nile.trongrid.io' });
const { v4: uuidv4 } = require('uuid');
const axios = require('axios');
let TRX_RATE;

async function getTrxRate() {
    try {
        // 1️⃣ CryptoCompare
        const response = await axios.get('https://min-api.cryptocompare.com/data/price?fsym=TRX&tsyms=USD');
        TRX_RATE = parseFloat(response.data.USD);
        return { source: 'CryptoCompare', rate: response.data.USD };
    } catch (error) {
        console.log('CryptoCompare недоступен, пробуем CoinGecko...');
    }

    try {
        // 2️⃣ CoinGecko
        const response = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=tron&vs_currencies=usd');
        TRX_RATE = parseFloat(response.data.tron.usd);
        return { source: 'CoinGecko', rate: response.data.tron.usd };
    } catch (error) {
        console.log('CoinGecko недоступен, пробуем Binance...');
    }

    try {
        // 3️⃣ Binance
        const response = await axios.get('https://api.binance.com/api/v3/ticker/price?symbol=TRXUSDT');
        TRX_RATE = parseFloat(response.data.price);
        return { source: 'Binance', rate: parseFloat(response.data.price) };
    } catch (error) {
        console.log('Binance тоже недоступен. Нет данных.');
    }

    return { error: 'Не удалось получить курс TRX' };
}

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
async function createShipment(companyId, supplierId, fiatAmount, status, handler, name, description) {
    const shipmentUuid = uuidv4(); // Генерация UUID

    await getTrxRate();

    let trxAmount = (parseFloat(fiatAmount) / TRX_RATE).toFixed(6)

    try {
        // Получение wallet_address из таблицы suppliers
        const supplierQuery = `
            SELECT wallet_address FROM suppliers WHERE id = $1;
        `;
        const supplierResult = await pool.query(supplierQuery, [supplierId]);
        if (supplierResult.rows.length === 0) {
            throw new Error('Supplier not found');
        }

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
            'USD',
            trxAmount,
            status,
            handler,
            name,
            description
        ]);
        const createdShipment = result.rows[0];

        console.log(process.env.OUR_WALLET)

        // Возвращаем результат с токеном
        return {
            shipmentId: createdShipment.id,
            payWallet: process.env.OUR_WALLET,
            sendTrxSumm: trxAmount,
            sendUsdtSumm: fiatAmount,
            message: 'Shipment created and waiting for transaction',
        };
    } catch (error) {
        console.error('Error creating shipment:', error);
        throw error;
    }
}

// Функция для создания транзакции
async function createTransaction(shipmentId, blockchainTxId, trxAmount, usdtAmount) {
    try {
        const checkQuery = `
            SELECT id FROM transactions WHERE blockchain_tx_id = $1
        `;

        const checkResult = await pool.query(checkQuery, [blockchainTxId]);

        console.log(checkResult.rows);

        if (checkResult.rows.length > 0 ){
            return 'This tx was processed before'
        }

        const result = await checkTx(blockchainTxId, trxAmount, usdtAmount);

        console.log(result);

        if (result.error) {
            return result.error
        }
        
        const transactionQuery = `
            INSERT INTO transactions (shipment_id, amount, blockchain_tx_id, token_name)
            VALUES ($1, $2, $3, $4)
            RETURNING *;
        `;

        const transactionResult = await pool.query(transactionQuery, [
            shipmentId,
            result.amount,
            blockchainTxId,
            result.currency,
        ]);

        let cryptoToAdd;
        if(result.currency =='USDT') {
            cryptoToAdd = (parseFloat(usdtAmount) / TRX_RATE).toFixed(6)
        } else {
            cryptoToAdd = trxAmount
        }
        const processResult = await processShipment(shipmentId, blockchainTxId, cryptoToAdd, usdtAmount);

        console.log('transactionResult: ', transactionResult.rows[0])
        return { transaction: transactionResult.rows[0], shipment: processResult }; // Возвращаем созданную запись
    } catch (error) {
        console.error('Error creating transaction:', error);
        throw error;
    }
};

const tokenMap = {
    'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t': 'USDT'
};

async function checkTx(blockchainTxId, trxAmount, usdtAmount) {
    const ourWallet = process.env.OUR_WALLET;

    try {
        const { data } = await axios.post(
            'https://nile.trongrid.io/walletsolidity/gettransactionbyid',
            { value: blockchainTxId }
        );

        if (!data.raw_data) {
            console.log('Транзакция не найдена или неподтверждена');
            return { error: 'Транзакция не найдена или неподтверждена' };
        }

        const contract = data.raw_data.contract[0];
        const { type, parameter: { value } } = contract;

        if (type === 'TriggerSmartContract') {
            const contractAddress = tronWeb.address.fromHex(value.contract_address);

            const dataHex = value.data;
            const toAddressHex = '41' + dataHex.substr(8 + 24, 40);
            const to = tronWeb.address.fromHex(toAddressHex);

            const amountHex = dataHex.substr(8 + 64, 64);
            const amount = parseInt(amountHex, 16) / 1_000_000_000;

            const tokenName = tokenMap[contractAddress] || `Неизвестный токен (contract: ${contractAddress})`;

            if (tokenName !== 'USDT') {
                return { error: 'Не верный токен' };
            }

            if (to !== ourWallet) {
                return { error: 'Не тот кошелек' };
            }

            if (parseFloat(usdtAmount) > parseFloat(amount)) {
                return { error: 'Не достаточно токенов' };
            }

            return { success: true, amount, currency: 'USDT' };

        } else if (type === 'TransferContract') {
            console.log(1)
            const to = tronWeb.address.fromHex(value.to_address);
            const amount = value.amount / 1_000_000;
            console.log(trxAmount)

            if (to !== ourWallet) {
                return { error: 'Не тот кошелек' };
            }

            if (parseFloat(trxAmount) > parseFloat(amount)) {
                return { error: 'Не достаточно средств' };
            }

            return { success: true, amount, currency: 'TRX' };

        } else {
            return { error: `Неизвестный тип контракта: ${type}` };
        }

    } catch (error) {
        console.error('Ошибка при проверке транзакции:', error.message);
        return { error: 'Ошибка при запросе или обработке транзакции' };
    }
}

async function processShipment(shipmentId, txHash, cryptoToAdd, fiatToAdd) {
    try {
        // Получение отправления
        const shipmentQuery = `SELECT * FROM shipments WHERE id = $1`;
        const shipmentResult = await pool.query(shipmentQuery, [shipmentId]);

        if (shipmentResult.rowCount === 0) {
            throw new Error('Shipment not found');
        }

        const shipment = shipmentResult.rows[0];
        const shipmentUuid = shipment.uuid;

        if (!shipment.init) {
            const supplierId = shipment.supplier_id
            const companyId = shipment.company_id
            // Обновляем статус init
            const statusQuery = `UPDATE shipments SET init = true WHERE id = $1`;
            await pool.query(statusQuery, [shipmentId]);

            const supplierQuery = `SELECT wallet_address FROM suppliers WHERE id = $1`
            const supplierResult = await pool.query(supplierQuery, [supplierId]);

            // Регистрируем отправление в смарт-контракте
            const contractResult = await contract.registerShipment(shipmentUuid, supplierResult.rows[0].wallet_address);
            if (!contractResult.success) {
                throw new Error('Failed to register shipment in the smart contract');
            }

            const transactionResult = await contract.processPayment(txHash, shipmentUuid);
            if (!transactionResult.success) {
                throw new Error('Failed to process payment in the smart contract');
            }

            // Генерация JWT токена
            const token = jwt.sign(
                { shipmentUuid, companyId, supplierId },
                process.env.JWT_SECRET
            );

            return {
                shipmentUuid,
                token,
                message: 'Shipment initialized successfully',
            };
        } else {
            // Обработка платежа в контракте
            await contract.processPayment(txHash, shipmentUuid);

            // Обновление сумм
            const updateQuery = `
                UPDATE shipments
                SET 
                    crypto_amount = crypto_amount + $1,
                    fiat_amount = fiat_amount + $2
                WHERE id = $3
            `;

            const result = await pool.query(updateQuery, [cryptoToAdd, fiatToAdd, shipmentId]);

            console.log(`Обновлено строк: ${result.rowCount}`);

            return {
                shipmentUuid,
                message: 'Shipment transaction added successfully',
            };
        }
    } catch (error) {
        console.error('Ошибка в processShipment:', error.message);
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

async function getAmountByUuid(uuid) {
    try {
        // Добавление токена в черный список
        const result = await pool.query(
            'SELECT crypto_amount FROM shipments WHERE uuid = $1',
            [uuid]
        );
        const amount = parseFloat(result.rows[0].crypto_amount); // Предполагается, что это число
        const roundedAmount = parseFloat(amount.toFixed(6));
        return roundedAmount
    } catch (error) {
        console.error('Error revoking token:', error);
        throw error;
    }
};

async function getShipment(shipmentID) {
    try {
        const shipmentQuery = `
            SELECT 
                sh.id,
                sh.uuid,
                sh.company_id,
                sh.supplier_id,
                sh.fiat_amount,
                sh.fiat_currency,
                sh.crypto_amount,
                sh.status,
                sh.handler,
                sh.name AS shipment_name,
                sh.description AS shipment_description,
                sh.init,
                sh.created_at,
                sh.updated_at,
                s.name AS supplier_name,
                s.description AS supplier_description,
                c.name AS company_name
            FROM shipments sh
            JOIN suppliers s ON sh.supplier_id = s.id
            JOIN companies c ON sh.company_id = c.id
            WHERE sh.id = $1
        `;

        const result = await pool.query(shipmentQuery, [shipmentID]);
        const shipmentDB = result.rows[0];

        const contractData = await contract.getShipment(shipmentDB.uuid);

        const transactionQuery = `
            SELECT 
                *
            FROM transactions
            WHERE shipment_id = $1
        `

        const transactionsResult = await pool.query(transactionQuery, [shipmentID]);

        return { database: shipmentDB, blockchain: contractData.data, transactions: transactionsResult.rows };
    } catch (err) {
        console.error(err);
        throw err;
    }
}

const getShipments = async (type, id, filters = {}) => {
    try {
        // Проверка корректности типа
        if (type !== 'company' && type !== 'supplier') {
            throw new Error("Invalid type. Expected 'company' or 'supplier'.");
        }

        // Определение столбца для фильтрации
        const filterColumn = type === 'company' ? 'c.id' : 's.id';

        // Базовый SQL-запрос с JOIN для получения данных из связанных таблиц
        let query = `
            SELECT 
                sh.id,
                sh.uuid,
                c.name AS company_name,
                s.name AS supplier_name,
                sh.status,
                sh.handler,
                sh.name AS shipment_name,
                sh.init,
                sh.created_at,
                sh.updated_at
            FROM shipments sh
            LEFT JOIN companies c ON sh.company_id = c.id
            LEFT JOIN suppliers s ON sh.supplier_id = s.id
            WHERE ${filterColumn} = $1
        `;

        // Массив параметров для запроса
        const queryParams = [id];
        let paramIndex = 2; // Индекс для новых параметров (начинается с 2, так как $1 уже используется)

        // Добавление фильтров
        if (filters.created_after) {
            query += ` AND sh.created_at >= $${paramIndex}`;
            queryParams.push(filters.created_after);
            paramIndex++;
        }

        if (filters.created_before) {
            query += ` AND sh.created_at <= $${paramIndex}`;
            queryParams.push(filters.created_before);
            paramIndex++;
        }

        if (filters.updated_after) {
            query += ` AND sh.updated_at >= $${paramIndex}`;
            queryParams.push(filters.updated_after);
            paramIndex++;
        }

        if (filters.updated_before) {
            query += ` AND sh.updated_at <= $${paramIndex}`;
            queryParams.push(filters.updated_before);
            paramIndex++;
        }

        if (filters.status) {
            query += ` AND sh.status = $${paramIndex}`;
            queryParams.push(filters.status);
            paramIndex++;
        }

        if (filters.handler) {
            query += ` AND sh.handler = $${paramIndex}`;
            queryParams.push(filters.handler);
            paramIndex++;
        }

        // Выполнение запроса
        const result = await pool.query(query, queryParams);

        // Возвращаем результат
        return result.rows;
    } catch (error) {
        console.error('Error in getShipments:', error.message);
        throw error; // Передаем ошибку дальше
    }
};

module.exports = {
    createCompany,
    createSupplier,
    createShipment,
    createTransaction,
    getCompaniesAndSuppliers,
    createEntity,
    revokeToken,
    getAmountByUuid,
    getShipments,
    getShipment
};