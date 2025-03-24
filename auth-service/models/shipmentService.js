const axios = require('axios');
require('dotenv').config();

const SHIPMENT_URL = process.env.SHIPMENT_URL;

// Получение списка компаний и поставщиков
async function getEntities() {
    try {
        const response = await axios.get(`${SHIPMENT_URL}/getEntities`);
        return response.data.data;
    } catch (error) {
        console.error('Error fetching entities:', error.message);
        throw new Error('Failed to fetch entities from external service');
    }
}

// Добавление новой компании или поставщика
async function addEntity(type, name) {
    try {
        const response = await axios.post(`${SHIPMENT_URL}/createEntity`, { type, name });
        return response.data;
    } catch (error) {
        console.error(`Error adding ${type}:`, error.message);
        throw new Error(`Failed to add ${type}`);
    }
}

module.exports = { getEntities, addEntity };