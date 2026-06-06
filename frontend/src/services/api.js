import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const verifyAdmin = async (code) => {
    const response = await axios.post(`${API_URL}/verify-admin`, { code });
    return response.data;
};

export const getStats = async () => {
    const response = await axios.get(`${API_URL}/inventory/stats`);
    return response.data;
};

export const getSuggestions = async (query) => {
    const response = await axios.get(`${API_URL}/products/suggestions?q=${encodeURIComponent(query)}`);
    return response.data;
};

export const getProducts = async () => {
    const response = await axios.get(`${API_URL}/products`);
    return response.data;
};

export const addProduct = async (product) => {
    const response = await axios.post(`${API_URL}/products`, product);
    return response.data;
};

export const updateProduct = async (name, product) => {
    const response = await axios.put(`${API_URL}/products/${name}`, product);
    return response.data;
};

export const deleteProduct = async (name) => {
    const response = await axios.delete(`${API_URL}/products/${name}`);
    return response.data;
};

export const importProducts = async (products) => {
    const response = await axios.post(`${API_URL}/products/import`, { products });
    return response.data;
};

export const findRoute = async (start, end) => {
    const response = await axios.post(`${API_URL}/find-route`, { start, end });
    return response.data;
};
