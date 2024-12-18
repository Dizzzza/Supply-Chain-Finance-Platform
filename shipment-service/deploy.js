const TronWeb = require('tronweb');
const solc = require('solc');
const fs = require('fs');

// Настройки для Tron Nile Testnet
const tronWeb = new TronWeb({
    fullHost: 'https://nile.trongrid.io', // Хост Tron Nile
    headers: { 'TRON-PRO-API-KEY': '6551207c-23e5-435d-a947-4aecd029444a' }, // API-ключ для доступа
    privateKey: 'c20980e62c2d9b4cbc6b87239d0fa7281e02928bbc50a2e8b6eea12bbdbdd93e', // Приватный ключ аккаунта
});

const contractCode = fs.readFileSync('./SupplyChain.sol', 'utf8');

// Настройки для компиляции
const input = {
    language: 'Solidity',
    sources: {
        'SupplyChain.sol': {
            content: contractCode,
        },
    },
    settings: {
        optimizer: {
            enabled: true, // Включить оптимизацию
            runs: 200,
        },
        outputSelection: {
            '*': {
                '*': ['abi', 'evm.bytecode'],
            },
        },
    },
};

// Компиляция контракта
const output = JSON.parse(solc.compile(JSON.stringify(input)));

// Получение ABI и байт-кода
const abi = output.contracts['SupplyChain.sol']['SupplyChain'].abi;
const bytecode = output.contracts['SupplyChain.sol']['SupplyChain'].evm.bytecode.object;

async function deploy_contract() {
    try {
        let contract_instance = await tronWeb.contract().new({
            abi: abi,  // Используем уже распарсенный объект
            bytecode: bytecode,
            feeLimit: 1_000_000_000,  // лимит газа для транзакции
            callValue: 0,             // сумма, которая будет передана контракту
            userFeePercentage: 1,     // процент на оплату комиссии пользователем
            originEnergyLimit: 10_000_000, // лимит энергии для транзакции
        });
        

        console.log('Контракт развернут по адресу:', contract_instance.address);
    } catch (error) {
        console.error('Ошибка развертывания:', error);
    }
}

deploy_contract();
