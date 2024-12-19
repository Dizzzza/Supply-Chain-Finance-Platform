const TronWeb = require('tronweb');

// Конфигурация TronWeb
const tronWeb = new TronWeb({
  fullHost: 'https://api.nileex.io', // Используйте правильный URL для TRON NILE TESTNET
  privateKey: 'c20980e62c2d9b4cbc6b87239d0fa7281e02928bbc50a2e8b6eea12bbdbdd93e', // Здесь нужно указать ваш приватный ключ для подписания транзакций
});

// Адрес вашего контракта
const contractAddress = 'TSkx7ZCDspvNdXbGTM8pmmQCYemhU7Zq6g'; // Замените на адрес контракта

// ABI контракта (сокращенный пример)
const abi = [
  {
  "inputs": [
    { "name": "productId", "type": "uint256" },
    { "name": "name", "type": "string" },
    { "name": "owner", "type": "address" }
  ],
  "name": "ProductRegistered",
  "type": "Event"
  },
  {
  "inputs": [
    { "name": "productId", "type": "uint256" },
    { "name": "status", "type": "string" },
    { "name": "timestamp", "type": "uint256" }
  ],
  "name": "StatusUpdated",
  "type": "Event"
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
  "type": "Event"
  },
  {
    "outputs": [{
      "type": "tuple",
      "components": [
        { "name": "id", "type": "uint256" },
        { "name": "name", "type": "string" },
        { "name": "description", "type": "string" },
        { "name": "owner", "type": "address" },
        { "name": "statusTimestamps", "type": "uint256[]" },
        { "name": "statusHistory", "type": "string[]" },
        { "name": "transactionIds", "type": "uint256[]" }
      ]
    }],
    "inputs": [{ "name": "productId", "type": "uint256" }],
    "name": "getProduct",
    "stateMutability": "view",
    "type": "function"
  },  
  {
  "outputs": [{ "type": "tuple" }],
  "inputs": [{ "name": "transactionId", "type": "uint256" }],
  "name": "getTransaction",
  "stateMutability": "View",
  "type": "Function"
  },
  {
  "outputs": [{ "type": "uint256" }],
  "inputs": [
    { "name": "productId", "type": "uint256" },
    { "name": "recipient", "type": "address" },
    { "name": "amount", "type": "uint256" }
  ],
  "name": "processPayment",
  "stateMutability": "Nonpayable",
  "type": "Function"
  },
  {
  "outputs": [
    { "name": "id", "type": "uint256" },
    { "name": "name", "type": "string" },
    { "name": "description", "type": "string" },
    { "name": "owner", "type": "address" }
  ],
  "inputs": [{ "type": "uint256" }],
  "name": "products",
  "stateMutability": "View",
  "type": "Function"
  },
  {
  "inputs": [
    { "name": "productId", "type": "uint256" },
    { "name": "name", "type": "string" },
    { "name": "description", "type": "string" }
  ],
  "name": "registerProduct",
  "stateMutability": "Nonpayable",
  "type": "Function"
  },
  {
  "outputs": [
    { "name": "transactionId", "type": "uint256" },
    { "name": "sender", "type": "address" },
    { "name": "recipient", "type": "address" },
    { "name": "amount", "type": "uint256" },
    { "name": "timestamp", "type": "uint256" },
    { "name": "status", "type": "string" }
  ],
  "inputs": [{ "type": "uint256" }],
  "name": "transactions",
  "stateMutability": "View",
  "type": "Function"
  },
  {
  "inputs": [
    { "name": "productId", "type": "uint256" },
    { "name": "status", "type": "string" }
  ],
  "name": "updateStatus",
  "stateMutability": "Nonpayable",
  "type": "Function"
  }
];

// Создайте объект контракта
const contract = tronWeb.contract(abi, contractAddress);

// Пример вызова метода контракта (например, getProduct)
async function getProduct(productId) {
    try {
      const product = await contract.getProduct(productId).call();
      console.log('Product data:', product);
    } catch (error) {
      console.error('Error fetching product:', error);
    }
  }
  

// Пример регистрации продукта через смарт-контракт
async function registerProduct(productId, name, description) {
    try {
      const result = await contract.registerProduct(productId, name, description).send();
      console.log('Product registered:', result);
    } catch (error) {
      console.error('Error registering product:', error);
    }
  }
  
  
// Вызов функции
getProduct(1);
