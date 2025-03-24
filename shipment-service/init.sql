CREATE TABLE companies (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE suppliers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    wallet_address VARCHAR(64),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE shipments (
    id SERIAL PRIMARY KEY,
	uuid VARCHAR(64) UNIQUE,
    company_id INTEGER NOT NULL,
    supplier_id INTEGER NOT NULL,
    fiat_amount DECIMAL(18, 2),
    fiat_currency VARCHAR(10),
    crypto_amount DECIMAL(18, 8),
    status VARCHAR(50),
	handler VARCHAR(50),
	name VARCHAR(50),
	description VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES companies(id),
    FOREIGN KEY (supplier_id) REFERENCES suppliers(id)
);

CREATE TABLE blockchain_networks (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    network_id VARCHAR(100) NOT NULL,
    explorer_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE transactions (
    id SERIAL PRIMARY KEY,
    shipment_id INTEGER NOT NULL,
    amount DECIMAL(18, 8) NOT NULL,
    currency VARCHAR(10) NOT NULL,
    blockchain_tx_id VARCHAR(255),
    status VARCHAR(50),
    blockchain_id INTEGER NOT NULL,
    token_id INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (shipment_id) REFERENCES shipments(id),
    FOREIGN KEY (blockchain_id) REFERENCES blockchain_networks(id)
);

CREATE TABLE token_blacklist (
    id SERIAL PRIMARY KEY,
    token VARCHAR(500) NOT NULL UNIQUE,
    expires_at TIMESTAMP NOT NULL
);