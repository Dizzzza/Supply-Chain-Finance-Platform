const fs = require('fs');
const TronWeb = require('tronweb');

// Считываем ABI контракта
const contractAbi = JSON.parse(fs.readFileSync('./SupplyChain.abi.json', 'utf8'));

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
