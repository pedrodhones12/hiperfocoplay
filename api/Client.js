
// apiClient.js → RESPONSÁVEL POR CONSUMIR A API EXTERNA

const axios = require('axios');
require('dotenv').config();

const apiClient = axios.create({
  baseURL: 'https://api.hiperfocoplay.com',
  headers: {
    Authorization: `Bearer ${process.env.API_KEY}`
  }
});

module.exports = apiClient;
