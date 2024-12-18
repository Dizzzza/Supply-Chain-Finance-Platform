const TronWeb = require('tronweb');
const solc = require('solc');

// Настройки для Tron Nile Testnet
const tronWeb = new TronWeb({
    fullHost: 'https://nile.trongrid.io', // Хост Tron Nile
    headers: { 'TRON-PRO-API-KEY': '6551207c-23e5-435d-a947-4aecd029444a' }, // API-ключ для доступа
    privateKey: 'c20980e62c2d9b4cbc6b87239d0fa7281e02928bbc50a2e8b6eea12bbdbdd93e', // Приватный ключ аккаунта
});

const contractCode = `
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SupplyChain {
    struct Product {
        uint256 id;
        string name;
        string description;
        address owner;
        uint256[] statusTimestamps;
        string[] statusHistory;
        uint256[] transactionIds;
    }

    struct Transaction {
        uint256 transactionId;
        address sender;
        address recipient;
        uint256 amount;
        uint256 timestamp;
        string status;
    }

    mapping(uint256 => Product) public products;
    mapping(uint256 => Transaction) public transactions;

    event ProductRegistered(uint256 productId, string name, address owner);
    event StatusUpdated(uint256 productId, string status, uint256 timestamp);
    event TransactionProcessed(uint256 transactionId, address sender, address recipient, uint256 amount, uint256 timestamp);

    function registerProduct(uint256 productId, string memory name, string memory description) public {
        require(products[productId].id == 0, "Product already exists");

        Product storage newProduct = products[productId];
        newProduct.id = productId;
        newProduct.name = name;
        newProduct.description = description;
        newProduct.owner = msg.sender;

        emit ProductRegistered(productId, name, msg.sender);
    }

    function updateStatus(uint256 productId, string memory status) public {
        require(products[productId].id != 0, "Product does not exist");
        require(products[productId].owner == msg.sender, "Only owner can update status");

        products[productId].statusHistory.push(status);
        products[productId].statusTimestamps.push(block.timestamp);

        emit StatusUpdated(productId, status, block.timestamp);
    }

    function processPayment(uint256 productId, address recipient, uint256 amount) public returns (uint256) {
        uint256 transactionId = uint256(keccak256(abi.encodePacked(block.timestamp, msg.sender, recipient, amount)));
        
        Transaction storage newTransaction = transactions[transactionId];
        newTransaction.transactionId = transactionId;
        newTransaction.sender = msg.sender;
        newTransaction.recipient = recipient;
        newTransaction.amount = amount;
        newTransaction.timestamp = block.timestamp;
        newTransaction.status = "Processed";

        products[productId].transactionIds.push(transactionId);

        emit TransactionProcessed(transactionId, msg.sender, recipient, amount, block.timestamp);

        return transactionId;
    }

    function getTransaction(uint256 transactionId) public view returns (Transaction memory) {
        require(transactions[transactionId].transactionId != 0, "Transaction does not exist");
        return transactions[transactionId];
    }

    function getProduct(uint256 productId) public view returns (Product memory) {
        require(products[productId].id != 0, "Product does not exist");
        return products[productId];
    }
}
`;

const compiledContract = JSON.parse(
    solc.compile(
        JSON.stringify({
            language: 'Solidity',
            sources: {
                'SupplyChain.sol': {
                    content: contractCode,
                },
            },
            settings: {
                outputSelection: {
                    '*': {
                        '*': ['abi', 'evm.bytecode'],
                    },
                },
            },
        })
    )
);

// Получение ABI и байткода
const abi = compiledContract.contracts['SupplyChain.sol']['SupplyChain'].abi;
const bytecode = compiledContract.contracts['SupplyChain.sol']['SupplyChain'].evm.bytecode.object;

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
