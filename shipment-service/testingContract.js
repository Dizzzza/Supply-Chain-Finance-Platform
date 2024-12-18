const fs = require('fs');
const TronWeb = require('tronweb');

// Считываем ABI контракта
const contractAbi = JSON.parse(`{"entrys":[{"inputs":[{"name":"productId","type":"uint256"},{"name":"name","type":"string"},{"name":"owner","type":"address"}],"name":"ProductRegistered","type":"Event"},{"inputs":[{"name":"productId","type":"uint256"},{"name":"status","type":"string"},{"name":"timestamp","type":"uint256"}],"name":"StatusUpdated","type":"Event"},{"inputs":[{"name":"transactionId","type":"uint256"},{"name":"sender","type":"address"},{"name":"recipient","type":"address"},{"name":"amount","type":"uint256"},{"name":"timestamp","type":"uint256"}],"name":"TransactionProcessed","type":"Event"},{"outputs":[{"type":"tuple"}],"inputs":[{"name":"productId","type":"uint256"}],"name":"getProduct","stateMutability":"View","type":"Function"},{"outputs":[{"type":"tuple"}],"inputs":[{"name":"transactionId","type":"uint256"}],"name":"getTransaction","stateMutability":"View","type":"Function"},{"outputs":[{"type":"uint256"}],"inputs":[{"name":"productId","type":"uint256"},{"name":"recipient","type":"address"},{"name":"amount","type":"uint256"}],"name":"processPayment","stateMutability":"Nonpayable","type":"Function"},{"outputs":[{"name":"id","type":"uint256"},{"name":"name","type":"string"},{"name":"description","type":"string"},{"name":"owner","type":"address"}],"inputs":[{"type":"uint256"}],"name":"products","stateMutability":"View","type":"Function"},{"inputs":[{"name":"productId","type":"uint256"},{"name":"name","type":"string"},{"name":"description","type":"string"}],"name":"registerProduct","stateMutability":"Nonpayable","type":"Function"},{"outputs":[{"name":"transactionId","type":"uint256"},{"name":"sender","type":"address"},{"name":"recipient","type":"address"},{"name":"amount","type":"uint256"},{"name":"timestamp","type":"uint256"},{"name":"status","type":"string"}],"inputs":[{"type":"uint256"}],"name":"transactions","stateMutability":"View","type":"Function"},{"inputs":[{"name":"productId","type":"uint256"},{"name":"status","type":"string"}],"name":"updateStatus","stateMutability":"Nonpayable","type":"Function"}]}`);

async function main() {
    // Инициализация TronWeb
    const tronWeb = new TronWeb({
        fullHost: 'https://nile.trongrid.io', // Используем Nile Testnet
        privateKey: process.env.TRON_API_KEY  // Приватный ключ
    });

    const contractAddress = 'TRGoaALkcN6ykgD1t65gihC2eREc7nzWAJ';

    // Создаем экземпляр контракта
    const contract = await tronWeb.contract(contractAbi, contractAddress);

    const productId = 1;
    const name = "Product Name";
    const description = "Product Description";

    try {
        // Регистрируем продукт
        const tx = await contract.registerProduct(productId, name, description).send({
            feeLimit: 100_000_000,  // Лимит комиссии
            callValue: 0            // Отправка TRX, если требуется
        });
        console.log("Продукт зарегистрирован, транзакция:", tx);

        // Получаем данные о продукте
        const product = await contract.getProduct(productId).call();
        console.log("Данные продукта:", product);
    } catch (error) {
        console.error("Ошибка при взаимодействии с контрактом:", error);
    }
}

// Запуск асинхронной функции
main().catch(error => {
    console.error("Ошибка при запуске:", error);
});
