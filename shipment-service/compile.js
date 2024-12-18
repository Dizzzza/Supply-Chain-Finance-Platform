const solc = require('solc');
const fs = require('fs');

// Считываем код контракта из файла
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

// Сохранение ABI и байт-кода
fs.writeFileSync('./SupplyChain.abi.json', JSON.stringify(abi, null, 2));
fs.writeFileSync('./SupplyChain.bytecode.txt', bytecode);

console.log('ABI и байт-код успешно скомпилированы.');
