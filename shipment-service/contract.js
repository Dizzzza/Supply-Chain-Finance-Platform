const TronWeb = require('tronweb');
// Конфигурация TronWeb
const tronWeb = new TronWeb({
  fullHost: 'https://api.nileex.io', // Используйте правильный URL для TRON NILE TESTNET
  privateKey: '***', // Ваш приватный ключ
});

// Адрес вашего контракта
const contractAddress = 'TRNPxyWtQDWmBzzozu1qTd8WTAD22tVDhD'; // Замените на адрес контракта

// ABI контракта
const abi = [
  {
    "inputs": [
      { "name": "shipmentUuid", "type": "string" },
      { "name": "name", "type": "string" },
      { "name": "description", "type": "string" }
    ],
    "name": "registerShipment",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "name": "shipmentUuid", "type": "string" },
      { "name": "status", "type": "string" },
      { "name": "handler", "type": "string" }
    ],
    "name": "updateStatus",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "name": "transactionHash", "type": "string" },
      { "name": "shipmentUuid", "type": "string" }
    ],
    "name": "processPayment",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "shipmentUuid",
        "type": "string"
      }
    ],
    "name": "getShipment",
    "outputs": [
      {
        "components": [
          {
						"internalType": "string",
						"name": "uuid",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "name",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "description",
						"type": "string"
					},
					{
						"internalType": "address",
						"name": "owner",
						"type": "address"
					},
					{
						"internalType": "uint256[]",
						"name": "statusTimestamps",
						"type": "uint256[]"
					},
					{
						"internalType": "string[]",
						"name": "statusHistory",
						"type": "string[]"
					},
					{
						"internalType": "string[]",
						"name": "handlerHistory",
						"type": "string[]"
					},
					{
						"internalType": "string[]",
						"name": "transactionHashs",
						"type": "string[]"
					},
          {
						"internalType": "bool",
						"name": "exists",
						"type": "bool"
					}
				],
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },  
  {
    "inputs": [
      { "name": "shipmentUuid", "type": "string" },
      { "name": "status", "type": "string" },
      { "name": "handler", "type": "string" },
      { "name": "timestamp", "type": "uint256" }
    ],
    "name": "StatusUpdated",
    "outputs": [],
    "stateMutability": "view",
    "type": "event"
  },
  {
    "inputs": [
      { "name": "shipmentUuid", "type": "string" },
      { "name": "name", "type": "string" },
      { "name": "owner", "type": "address" }
    ],
    "name": "ShipmentRegistered",
    "outputs": [],
    "stateMutability": "view",
    "type": "event"
  },
  {
    "inputs": [
      { "name": "transactionHash", "type": "string" },
      { "name": "shipmentName", "type": "string" }
    ],
    "outputs": [],
    "stateMutability": "view",
    "name": "TransactionProcessed",
    "type": "event"
  }
];

// Создайте объект контракта
const contract = tronWeb.contract(abi, contractAddress);

// Пример регистрации продукта
async function registerShipment(uuid, name, description) {
  try {
    const result = await contract.registerShipment(uuid, name, description).send();
    console.log('Shipment registered:', result);
    return { success: true, data: result };
  } catch (error) {
    console.error('Error registering product:', error);
    return { success: false, error: error.message || error };
  }
}
exports.registerShipment = registerShipment;

// Пример получения продукта
async function getShipment(shipmentUuid) {
  try {
    const shipment = await contract.getShipment(shipmentUuid).call();
    const [
      uuid,
      name,
      description,
      owner,
      statusTimestampsRaw,
      statusHistory,
      handlerHistory,
      transactionHashs,
      exists
    ] = shipment;
    const statusTimestamps = statusTimestampsRaw.map(bn => bn.toNumber());

    // 🔹 Собираем всё в объект
    const parsedData = {
      uuid,
      name,
      description,
      owner,
      statusTimestamps,
      statusHistory,
      handlerHistory,
      transactionHashs,
      exists
    };
    return { success: true, data: parsedData };
  } catch (error) {
    console.error('Error fetching shipment:', error);
    return { success: false, error: error.message || error }
  }
}
exports.getShipment = getShipment;

async function updateStatus(shipmentId, status, handler) {
  try {
    const shipment = await contract.updateStatus(shipmentId, status, handler).send();
    console.log('Status data:', shipment);
    return { success: true, data: shipment };
  } catch (error) {
    console.error('Error fetching shipment:', error);
    return { success: false, error: error.message || error };
  }
}
exports.updateStatus = updateStatus;

async function processPayment(transactionHash, shipmentUuid) {
  try {
    const transaction = await contract.processPayment(transactionHash, shipmentUuid).send();
    console.log('Transaction data:', transaction);
    return { success: true, data: transaction };
  } catch (error) {
    console.error('Error fetching transaction:', error);
    return { success: false, error: error.message || error };
  }
}
exports.processPayment = processPayment;

// Вызовы функций
// (async () => {
//   // await registerShipment('second-shipment', 'second', 'second');
//   await getShipment('second-shipment');
//   // await updateStatus('second-shipment', 'Sent', 'Logistics');
//   // await getProduct(5);
//   // await processPayment('bfede5122e6b683d656f8591da1427410404739374fa8628f1324198de043f5e', 'second-shipment');
//   // await getProduct(5);
//   // await getTransaction('ae197296e66f15aa8dde5acb217c7886170b7512806cf3d57ab6177ba8d1bd34');
// })();