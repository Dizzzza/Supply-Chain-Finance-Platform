const TronWeb = require('tronweb');

// Конфигурация TronWeb
const tronWeb = new TronWeb({
  fullHost: 'https://api.nileex.io', // URL для TRON NILE TESTNET
  privateKey: 'c20980e62c2d9b4cbc6b87239d0fa7281e02928bbc50a2e8b6eea12bbdbdd93e', // Ваш приватный ключ
});

// Адрес вашего контракта
const contractAddress = 'TUhsFvUDipSwjhfX3MPB3674Qzksd7AVfS'; // Замените на адрес контракта

// ABI нового контракта
const abi = [
  {
    "inputs": [
      { "internalType": "string", "name": "shipmentUuid", "type": "string" },
      { "internalType": "address", "name": "_deliveryWallet", "type": "address" }
    ],
    "name": "registerShipment",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "string", "name": "shipmentUuid", "type": "string" },
      { "internalType": "string", "name": "status", "type": "string" },
      { "internalType": "string", "name": "handler", "type": "string" }
    ],
    "name": "updateStatus",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "string", "name": "transactionHash", "type": "string" },
      { "internalType": "string", "name": "shipmentUuid", "type": "string" }
    ],
    "name": "processPayment",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "string", "name": "shipmentUuid", "type": "string" }
    ],
    "name": "getShipment",
    "outputs": [
      {
        "components": [
          { "internalType": "string", "name": "uuid", "type": "string" },
          { "internalType": "address", "name": "owner", "type": "address" },
          { "internalType": "uint256[]", "name": "statusTimestamps", "type": "uint256[]" },
          { "internalType": "string[]", "name": "statusHistory", "type": "string[]" },
          { "internalType": "string[]", "name": "handlerHistory", "type": "string[]" },
          { "internalType": "string[]", "name": "transactionHashs", "type": "string[]" },
          { "internalType": "address", "name": "deliveryWallet", "type": "address" },
          { "internalType": "bool", "name": "exists", "type": "bool" }
        ],
        "internalType": "struct SupplyChain.Shipment",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

// Создаем объект контракта
const contract = tronWeb.contract(abi, contractAddress);

/**
 * Регистрация новой поставки.
 */
async function registerShipment(uuid, deliveryWallet) {
  try {
    const hexAddress = tronWeb.address.toHex(deliveryWallet);
    const result = await contract.registerShipment(uuid, hexAddress).send();
    console.log('Shipment registered:', result);
    return { success: true, data: result };
  } catch (error) {
    console.error('Error registering shipment:', error);
    return { success: false, error: error.message || error };
  }
}
exports.registerShipment = registerShipment;

/**
 * Получение информации о поставке.
 */
async function getShipment(shipmentUuid) {
    try {
        // Получаем данные о поставке
        const shipment = await contract.getShipment(shipmentUuid).call();

        const address = tronWeb.address.fromHex(shipment.deliveryWallet);
        // Извлекаем данные из объекта shipment
        const parsedData = {
          uuid: shipment.uuid, // Уникальный идентификатор поставки
          owner: shipment.owner, // Владелец поставки
          statusTimestamps: shipment.statusTimestamps.map(bn => bn.toNumber()), // Преобразуем BigNumber в числа
          statusHistory: shipment.statusHistory, // История статусов
          handlerHistory: shipment.handlerHistory, // История обработчиков
          transactionHashs: shipment.transactionHashs, // Хеши транзакций
          deliveryWallet: address, // Кошелек для доставки
          exists: shipment.exists, // Флаг существования поставки
        };

        // Возвращаем данные в удобном формате
        return { success: true, data: parsedData };
    } catch (error) {
        console.error('Error fetching shipment:', error);
        return { success: false, error: error.message || error };
    }
}
exports.getShipment = getShipment;

/**
 * Обновление статуса поставки.
 */
async function updateStatus(shipmentUuid, status, handler, amountInSun = 0) {
  try {
    const result = await contract.updateStatus(shipmentUuid, status, handler).send({
      callValue: amountInSun, // Количество SUN (1 TRX = 1e6 SUN)
    });
    console.log('Status updated:', result);
    return { success: true, data: result };
  } catch (error) {
    console.error('Error updating status:', error);
    return { success: false, error: error.message || error };
  }
}
exports.updateStatus = updateStatus;

/**
 * Добавление хеша транзакции.
 */
async function processPayment(transactionHash, shipmentUuid) {
  try {
    const result = await contract.processPayment(transactionHash, shipmentUuid).send();
    console.log('Transaction processed:', result);
    return { success: true, data: result };
  } catch (error) {
    console.error('Error processing payment:', error);
    return { success: false, error: error.message || error };
  }
}
exports.processPayment = processPayment;

// Вызовы функций
// (async () => {
//   await registerShipment('first-shipment', 'TNYC8crw4tRMLFqYTLXMQsh24qnM4TGKhZ');
//   await getShipment('first-shipment');
//   await updateStatus('first-shipment', 'Delivered', 'Retailer', 10 * 1e6);
//   await getProduct(5);
//   await processPayment('bfede5122e6b683d656f8591da1427410404739374fa8628f1324198de043f5e', 'second-shipment');
//   await getProduct(5);
//   await getTransaction('ae197296e66f15aa8dde5acb217c7886170b7512806cf3d57ab6177ba8d1bd34');
// })();