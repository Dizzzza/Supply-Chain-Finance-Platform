const TronWeb = require('tronweb');

// Конфигурация TronWeb
const tronWeb = new TronWeb({
  fullHost: 'https://api.nileex.io', // Используйте правильный URL для TRON NILE TESTNET
  privateKey: 'c20980e62c2d9b4cbc6b87239d0fa7281e02928bbc50a2e8b6eea12bbdbdd93e', // Здесь нужно указать ваш приватный ключ для подписания транзакций
});

// Адрес вашего контракта
const contractAddress = 'THUnvgrFUW9GqaJajGQWFZCBK1goyLZKJM'; // Замените на адрес контракта

// ABI контракта (сокращенный пример)
const abi = [
  {
    "inputs": [{"name":"productId","type":"uint256"},{"name":"name","type":"string"},{"name":"owner","type":"address"}],
    "name":"ProductRegistered",
    "type":"Event"
  },
  {
    "outputs": [{"type":"tuple"}],
    "inputs": [{"name":"productId","type":"uint256"}],
    "name":"getProduct",
    "stateMutability":"View",
    "type":"Function"
  },
  {
    "outputs": [{"name":"transactionId","type":"uint256"},{"name":"sender","type":"address"},{"name":"recipient","type":"address"},{"name":"amount","type":"uint256"},{"name":"timestamp","type":"uint256"}],
    "inputs": [{"type":"uint256"}],
    "name":"transactions",
    "stateMutability":"View",
    "type":"Function"
  },
  {
    "inputs": [{"name":"productId","type":"uint256"},{"name":"name","type":"string"},{"name":"description","type":"string"}],
    "name":"registerProduct",
    "stateMutability":"Nonpayable",
    "type":"Function"
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
getProduct(12345); // Пример получения продукта с ID = 12345
