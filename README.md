# Development of a Blockchain-Based Supply Chain Finance Platform

> # Link to [MATERIALS](https://eduiitu.sharepoint.com/:f:/s/KazTransLiveReal-TimeVideoTranslationSystem/EoCM8mjlxFJGsDybhExn8lIBCd61tYOGy9vLoeK7HKATcg?e=48q7C3) 

## Authors

- **Кисамединов Досжан Рүстемұлы** (ID: 31586)
- **Ким Артур Сергеевич** (ID: 31588)
- **Сванкулов Диас Болатович** (ID: 31585)
- **Лебедева Екатерина Олеговна** (ID: 31584)

## Abstract

The objective of this diploma project is to design and develop a blockchain-based supply chain finance platform utilizing the Tron network. By integrating blockchain technology into supply chain finance, the platform aims to enhance transparency, security, and efficiency in financial transactions between suppliers, buyers, and financiers. The project leverages modern technologies such as Node.js, React, PostgreSQL, and Web3 tools like TronGrid to create a decentralized application (DApp) that streamlines operations and reduces the reliance on intermediaries.

---

## Table of Contents

1. [Introduction](#introduction)
2. [Objectives](#objectives)
3. [Technologies Used](#technologies-used)
4. [System Architecture](#system-architecture)
5. [Installation Guide](#installation-guide)
6. [Usage Instructions](#usage-instructions)
7. [Project Structure](#project-structure)
8. [Features](#features)
9. [Conclusion](#conclusion)
10. [References](#references)
11. [Appendices](#appendices)

---

## Introduction

Supply chain finance plays a pivotal role in global trade, facilitating financial flows between suppliers, manufacturers, and retailers. Traditional supply chain finance systems often suffer from inefficiencies, lack of transparency, and high costs due to intermediaries.

Blockchain technology offers a promising solution by providing a decentralized ledger that enhances trust, transparency, and security. This project focuses on developing a supply chain finance platform on the Tron blockchain, aiming to revolutionize how financial transactions are conducted in the supply chain industry.

---

## Objectives

- **Develop a Decentralized Application (DApp):** Utilize the Tron blockchain to create a DApp that facilitates supply chain finance operations.
- **Implement Smart Contracts:** Automate financial agreements and transactions between parties using smart contracts.
- **Enhance Transparency and Security:** Leverage blockchain's immutable ledger to ensure transparent and secure transactions.
- **User-Friendly Interface:** Design an intuitive frontend using React for seamless user interaction.
- **Integrate Web3 Technologies:** Use TronGrid and TronWeb to enable blockchain interactions within the application.
- **Efficient Data Management:** Employ PostgreSQL for robust and secure data storage.

---

## Technologies Used

- **Blockchain Platform:** Tron, TronGrid
- **Backend Development:** Node.js
- **Frontend Development:** React.js
- **Database:** PostgreSQL
- **Web3 Integration:** TronWeb API
- **Smart Contracts Language:** Solidity (for Tron network)
- **Other Tools:** Git, npm, TronLink Wallet

---

## System Architecture

The platform consists of the following components:

- **Frontend (React.js):** Provides the user interface for interacting with the platform.
- **Backend (Node.js):** Handles business logic, smart contract interactions, and communicates with the database.
- **Blockchain Layer (Tron):** Hosts the smart contracts that manage the supply chain finance processes.
- **Database (PostgreSQL):** Stores user data, transaction history, and other off-chain information.
- **Web3 Provider (TronGrid):** Facilitates communication between the DApp and the Tron blockchain network.

---

## Installation Guide

### Prerequisites

- **Node.js** (version 14.x or higher)
- **PostgreSQL** (version 12.x or higher)
- **Git**
- **TronLink Wallet** (for blockchain interactions)
- **TronBox** (for smart contract deployment)

### Steps

1. **Clone the Repository**

   ```bash
   git clone https://github.com/your-repo/blockchain-supply-chain-finance.git
   ```

2. **Backend Setup**

   - Navigate to the backend directory:

     ```bash
     cd blockchain-supply-chain-finance/backend
     ```

   - Install dependencies:

     ```bash
     npm install
     ```

   - Configure environment variables by creating a `.env` file based on `.env.example`.

3. **Frontend Setup**

   - Navigate to the frontend directory:

     ```bash
     cd ../frontend
     ```

   - Install dependencies:

     ```bash
     npm install
     ```

   - Configure environment variables by creating a `.env` file based on `.env.example`.

4. **Database Setup**

   - Create a PostgreSQL database named `supply_chain_finance`.
   - Run migrations and seed data if applicable.

5. **Smart Contract Deployment**

   - Navigate to the smart contracts directory:

     ```bash
     cd ../smart-contracts
     ```

   - Install TronBox globally if not installed:

     ```bash
     npm install -g tronbox
     ```

   - Compile the smart contracts:

     ```bash
     tronbox compile
     ```

   - Deploy the smart contracts to the Tron network:

     ```bash
     tronbox migrate --network shasta
     ```

6. **Start the Backend Server**

   - Navigate to the backend directory and start the server:

     ```bash
     cd ../backend
     npm start
     ```

7. **Start the Frontend Server**

   - Navigate to the frontend directory and start the development server:

     ```bash
     cd ../frontend
     npm start
     ```

---

## Usage Instructions

1. **Access the Application**

   - Open your web browser and go to `http://localhost:3000`.

2. **Connect TronLink Wallet**

   - Ensure TronLink is installed and connected to the Shasta test network.

3. **Register an Account**

   - Sign up as a Supplier, Buyer, or Financier.

4. **Interact with the Platform**

   - Create purchase orders, invoices, and financing requests.
   - Approve transactions and view their status on the blockchain.

5. **View Transaction History**

   - Access detailed records of past transactions and smart contract interactions.

---

## Project Structure

```
blockchain-supply-chain-finance/
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── app.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── App.js
│   ├── public/
│   └── package.json
├── smart-contracts/
│   ├── contracts/
│   │   └── SupplyChainFinance.sol
│   ├── migrations/
│   ├── tronbox-config.js
│   └── package.json
├── README.md
└── LICENSE
```

---

## Features

- **Decentralized Finance Operations:** Utilize smart contracts for secure and automated financial transactions.
- **Role-Based Access Control:** Different functionalities for Suppliers, Buyers, and Financiers.
- **Real-Time Updates:** Live tracking of transaction statuses and blockchain confirmations.
- **Secure Data Management:** Sensitive information is securely stored and managed.
- **User Dashboard:** Comprehensive overview of activities, pending actions, and notifications.
- **Audit Trail:** Immutable records of all transactions for transparency and compliance.

---

## Conclusion

The developed platform demonstrates the potential of blockchain technology in transforming supply chain finance by enhancing security, transparency, and efficiency. By leveraging the Tron blockchain and modern web technologies, the platform provides a scalable and robust solution for stakeholders in the supply chain industry.

---

## References

1. **Tron Documentation:** [https://developers.tron.network/](https://developers.tron.network/)
2. **TronWeb API:** [https://github.com/tronprotocol/tron-web](https://github.com/tronprotocol/tron-web)
3. **React Documentation:** [https://reactjs.org/docs/getting-started.html](https://reactjs.org/docs/getting-started.html)
4. **Node.js Documentation:** [https://nodejs.org/en/docs/](https://nodejs.org/en/docs/)
5. **PostgreSQL Documentation:** [https://www.postgresql.org/docs/](https://www.postgresql.org/docs/)
6. **Solidity Documentation:** [https://docs.soliditylang.org/](https://docs.soliditylang.org/)

---

## Appendices

- **Appendix A:** Smart Contract Code (`SupplyChainFinance.sol`)
- **Appendix B:** API Endpoints Documentation
- **Appendix C:** UI Mockups and Design Wireframes
- **Appendix D:** Test Cases and Results

---

## Contact Information

For any inquiries or further information, please contact:

- **Kисамединов Досжан Рүстемұлы:** doszhan@gmail.com
- **Ким Артур Сергеевич:** arthur@gmail.com
- **Сванкулов Диас Болатович:** dias@gmail.com
- **Лебедева Екатерина Олеговна:** ekaterina@gmail.com

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
