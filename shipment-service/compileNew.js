const TronWeb = require('tronweb');

// Конфигурация TronWeb
const tronWeb = new TronWeb({
  fullHost: 'https://api.nileex.io', // Используйте правильный URL для TRON NILE TESTNET
  privateKey: 'c20980e62c2d9b4cbc6b87239d0fa7281e02928bbc50a2e8b6eea12bbdbdd93e', // Ваш приватный ключ
});

// Адрес вашего контракта
const contractAddress = 'THUnvgrFUW9GqaJajGQWFZCBK1goyLZKJM'; // Замените на адрес контракта

// ABI контракта
const abi = [
  {
    "inputs": [
      { "name": "productId", "type": "uint256" },
      { "name": "name", "type": "string" },
      { "name": "description", "type": "string" }
    ],
    "name": "registerProduct",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "name": "productId", "type": "uint256" },
      { "name": "status", "type": "string" }
    ],
    "name": "updateStatus",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
	"inputs": [
	  { "name": "productId", "type": "uint256" },
	  { "name": "recipient", "type": "address" },
	  { "name": "amount", "type": "uint256" }
	],
	"name": "processPayment",
	"outputs": [
	  { "name": "", "type": "uint256" }
	],
	"stateMutability": "nonpayable",
	"type": "function"
  },  
  {
    "inputs": [
      { "name": "transactionId", "type": "uint256" }
    ],
    "name": "getTransaction",
    "outputs": [
      { "name": "transactionId", "type": "uint256" },
      { "name": "sender", "type": "address" },
      { "name": "recipient", "type": "address" },
      { "name": "amount", "type": "uint256" },
      { "name": "timestamp", "type": "uint256" },
      { "name": "status", "type": "string" }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      { "name": "productId", "type": "uint256" }
    ],
    "name": "getProduct",
    "outputs": [
      { "name": "id", "type": "uint256" },
      { "name": "name", "type": "string" },
      { "name": "description", "type": "string" },
      { "name": "owner", "type": "address" },
      { "name": "statusTimestamps", "type": "uint256[]" },
      { "name": "statusHistory", "type": "string[]" },
      { "name": "transactionIds", "type": "uint256[]" }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      { "name": "productId", "type": "uint256" },
      { "name": "status", "type": "string" }
    ],
    "name": "StatusUpdated",
    "outputs": [],
    "stateMutability": "view",
    "type": "event"
  },
  {
    "inputs": [
      { "name": "productId", "type": "uint256" },
      { "name": "name", "type": "string" },
      { "name": "owner", "type": "address" }
    ],
    "name": "ProductRegistered",
    "outputs": [],
    "stateMutability": "view",
    "type": "event"
  },
  {
    "inputs": [
      { "name": "transactionId", "type": "uint256" },
      { "name": "sender", "type": "address" },
      { "name": "recipient", "type": "address" },
      { "name": "amount", "type": "uint256" },
      { "name": "timestamp", "type": "uint256" }
    ],
    "name": "TransactionProcessed",
    "outputs": [],
    "stateMutability": "view",
    "type": "event"
  }
];

// Создайте объект контракта
const contract = tronWeb.contract(abi, contractAddress);

// Пример регистрации продукта
async function registerProduct(productId, name, description) {
  try {
    const result = await contract.registerProduct(productId, name, description).send();
    console.log('Product registered:', result);
  } catch (error) {
    console.error('Error registering product:', error);
  }
}

// Пример обновления статуса продукта
async function updateStatus(productId, status) {
  try {
    const result = await contract.updateStatus(productId, status).send();
    console.log('Status updated:', result);
  } catch (error) {
    console.error('Error updating status:', error);
  }
}

// Пример обработки платежа
async function processPayment(productId, recipient, amount) {
	try {
	  // Отправка транзакции
	  const result = await contract.methods.processPayment(productId, recipient, amount).send();
  
	  // Извлечение события из логов
	  console.log(result);
	} catch (error) {
	  console.error('Error processing payment:', error);
	}
  }
  

// Пример получения транзакции
async function getTransaction(transactionId) {
  try {
    // Проверяем, что transactionId существует и корректно передан
    if (!transactionId) {
      throw new Error('Invalid transactionId');
    }

    // Получаем данные о транзакции
    const transaction = await contract.getTransaction(transactionId).call();

    // Проверяем, что транзакция существует и не является пустой
    if (!transaction || transaction.transactionId === 0) {
      throw new Error('Transaction not found');
    }

    // Преобразуем числа в BigNumber (если это необходимо)
    const txId = tronWeb.toBigNumber(transaction.transactionId);
    const amount = tronWeb.toBigNumber(transaction.amount);
    const timestamp = tronWeb.toBigNumber(transaction.timestamp);

    console.log('Transaction data:', {
      transactionId: txId.toString(),
      sender: transaction.sender,
      recipient: transaction.recipient,
      amount: amount.toString(),
      timestamp: timestamp.toString()
    });

  } catch (error) {
    console.error('Error fetching transaction:', error.message || error);
  }
}

// Пример получения продукта
async function getProduct(productId) {
  try {
    const product = await contract.getProduct(productId).call();
    console.log('Product data:', product);
  } catch (error) {
    console.error('Error fetching product:', error);
  }
}

// Вызовы функций
(async () => {
	await processPayment(12345, 'TLFiemnie8b19BGGcDaj4rzPjKmszQeBT6', 1);
})();
