const axios = require('axios');
require('dotenv').config();

const SHIPMENT_URL = process.env.SHIPMENT_URL;

// Получение списка компаний и поставщиков
async function getEntities() {
    const AUTH_TOKEN = process.env.JWT_TOKEN; // можешь заменить на переменную окружения или передавать параметром

    try {
        const response = await axios.get(`${SHIPMENT_URL}/getEntities`, {
            headers: {
                Authorization: `Bearer ${AUTH_TOKEN}`
            }
        });
        return response.data.data;
    } catch (error) {
        console.error('Error fetching entities:', error.message);
        throw new Error('Failed to fetch entities from external service');
    }
}

// Добавление новой компании или поставщика
async function addEntity(type, name, description) {
    const AUTH_TOKEN = process.env.JWT_TOKEN;

    console.log('Sending request to shipment service:', {
        type,
        name,
        description
    });

    try {
        const response = await axios.post(`${SHIPMENT_URL}/createEntity`, { type, name, description }, {
            headers: {
                Authorization: `Bearer ${AUTH_TOKEN}`
            }
        });
        console.log('Response from shipment service:', response.data);
        return response.data;
    } catch (error) {
        console.error(`Error adding ${type}:`, error.message);
        throw new Error(`Failed to add ${type}`);
    }
}

module.exports = { getEntities, addEntity };