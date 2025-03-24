// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SupplyChain {
    struct Shipment {
        string uuid;
        string name;
        string description;
        address owner;
        uint256[] statusTimestamps;
        string[] statusHistory;
        string[] handlerHistory;
        string[] transactionHashs;
        bool exists;
    }

    mapping(bytes32 => Shipment) public shipments;

    event ShipmentRegistered(string shipmentUuid, string name, address owner);
    event StatusUpdated(string shipmentUuid, string status, string handler, uint256 timestamp);
    event TransactionProcessed(string transactionHash, string shipmentName);

    function registerShipment(string memory shipmentUuid, string memory name, string memory description) public {
        bytes32 shipmentKey = keccak256(abi.encodePacked(shipmentUuid));
        require(!shipments[shipmentKey].exists, "Shipment already exists");

        Shipment storage newShipment = shipments[shipmentKey];
        newShipment.uuid = shipmentUuid;
        newShipment.name = name;
        newShipment.description = description;
        newShipment.owner = msg.sender;
        newShipment.exists = true;
        shipments[shipmentKey].handlerHistory.push("Manufacturer");
        shipments[shipmentKey].statusHistory.push("Started");

        emit ShipmentRegistered(shipmentUuid, name, msg.sender);
    }

    function updateStatus(string memory shipmentUuid, string memory status, string memory handler) public {
        bytes32 shipmentKey = keccak256(abi.encodePacked(shipmentUuid));
        require(shipments[shipmentKey].exists, "Shipment does not exist");
        require(shipments[shipmentKey].owner == msg.sender, "Only owner can update status");

        shipments[shipmentKey].statusHistory.push(status);
        shipments[shipmentKey].handlerHistory.push(handler);
        shipments[shipmentKey].statusTimestamps.push(block.timestamp);

        emit StatusUpdated(shipmentUuid, status, handler, block.timestamp);
    }

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


    function getShipment(string memory shipmentUuid) public view returns (Shipment memory) {
        bytes32 shipmentKey = keccak256(abi.encodePacked(shipmentUuid));
        require(shipments[shipmentKey].exists, "Shipment does not exist");
        return shipments[shipmentKey];
    }
}
ver 0.8.6+commit.11564f7e