// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SupplyChain {
    struct Shipment {
        string uuid; // Уникальный идентификатор поставки
        address owner; // Владелец поставки
        uint256[] statusTimestamps; // Временные метки для каждого статуса
        string[] statusHistory; // История статусов
        string[] handlerHistory; // История обработчиков
        string[] transactionHashs; // Хеши транзакций
        address payable deliveryWallet; // Уникальный кошелек для доставки
        bool exists; // Флаг существования поставки
    }

    mapping(bytes32 => Shipment) public shipments;

    event ShipmentRegistered(string shipmentUuid, address owner);
    event StatusUpdated(string shipmentUuid, string status, string handler, uint256 timestamp);
    event TransactionProcessed(string transactionHash, string shipmentUuid);
    event PaymentSent(address indexed to, uint256 amount);

    /**
     * Регистрация новой поставки.
     */
    function registerShipment(
        string memory shipmentUuid,
        address payable _deliveryWallet
    ) public {
        bytes32 shipmentKey = keccak256(abi.encodePacked(shipmentUuid));
        require(!shipments[shipmentKey].exists, "Shipment already exists");
        require(_deliveryWallet != address(0), "Invalid delivery wallet address");

        Shipment storage newShipment = shipments[shipmentKey];
        newShipment.uuid = shipmentUuid;
        newShipment.owner = msg.sender;
        newShipment.deliveryWallet = _deliveryWallet; // Сохраняем уникальный кошелек для доставки
        newShipment.exists = true;
        shipments[shipmentKey].handlerHistory.push("Manufacturer");
        shipments[shipmentKey].statusHistory.push("Started");

        emit ShipmentRegistered(shipmentUuid, msg.sender);
    }

    /**
     * Обновление статуса поставки.
     */
    function updateStatus(string memory shipmentUuid, string memory status, string memory handler) public payable {
        bytes32 shipmentKey = keccak256(abi.encodePacked(shipmentUuid));
        require(shipments[shipmentKey].exists, "Shipment does not exist");
        require(shipments[shipmentKey].owner == msg.sender, "Only owner can update status");

        shipments[shipmentKey].statusHistory.push(status);
        shipments[shipmentKey].handlerHistory.push(handler);
        shipments[shipmentKey].statusTimestamps.push(block.timestamp);

        emit StatusUpdated(shipmentUuid, status, handler, block.timestamp);

        // Проверяем, если статус "Delivered", отправляем TRX на deliveryWallet
        if (keccak256(abi.encodePacked(status)) == keccak256(abi.encodePacked("Delivered"))) {
            require(msg.value > 0, "No payment included with status update"); // Убедитесь, что TRX были отправлены
            address payable deliveryWallet = shipments[shipmentKey].deliveryWallet;
            require(deliveryWallet != address(0), "Delivery wallet is not set");

            // Отправляем TRX на кошелек доставки
            (bool success, ) = deliveryWallet.call{value: msg.value}("");
            require(success, "Failed to send TRX");

            emit PaymentSent(deliveryWallet, msg.value);
        } else {
            // Для других статусов (например, "Sent") отправка TRX не требуется
            require(msg.value == 0, "Payment is not required for this status");
        }
    }

    /**
     * Добавление хеша транзакции.
     */
    function processPayment(string memory transactionHash, string memory shipmentUuid) public {
        bytes32 shipmentKey = keccak256(abi.encodePacked(shipmentUuid));
        require(shipments[shipmentKey].exists, "Shipment does not exist");
        require(shipments[shipmentKey].owner == msg.sender, "Only owner can add Transaction");

        // Проверка наличия transactionHash в массиве
        string[] storage transactionHashes = shipments[shipmentKey].transactionHashs;
        for (uint i = 0; i < transactionHashes.length; i++) {
            require(keccak256(abi.encodePacked(transactionHashes[i])) != keccak256(abi.encodePacked(transactionHash)), "Transaction already exists");
        }

        // Добавление нового хеша транзакции
        transactionHashes.push(transactionHash);

        emit TransactionProcessed(transactionHash, shipmentUuid);
    }

    /**
     * Получение информации о поставке.
     */
    function getShipment(string memory shipmentUuid) public view returns (Shipment memory) {
        bytes32 shipmentKey = keccak256(abi.encodePacked(shipmentUuid));
        require(shipments[shipmentKey].exists, "Shipment does not exist");
        return shipments[shipmentKey];
    }
}
ver 0.8.6+commit.11564f7e