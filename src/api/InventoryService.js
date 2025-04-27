import axios from 'axios';

const API_URL = '${API_BASE_URL}/api/ingredients';

// Hàm lấy token từ localStorage (hoặc sessionStorage, hoặc state)
const getAuthToken = () => {
    return localStorage.getItem('authToken');
};

const getAll = () => {
    const token = getAuthToken();

    return axios.get(API_URL, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
};

const getById = (id) => {
    const token = getAuthToken();

    return axios.get(`${API_URL}/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
};

const add = (item) => {
    const token = getAuthToken();

    const ingredientData = {
        name: item.name,
        quantity: parseFloat(item.quantity),
        unit: item.unit
    };

    return axios.post(API_URL, ingredientData, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
};

const update = (item) => {
    const token = getAuthToken();

    const ingredientData = {
        ingredient_id: item.ingredient_id,
        name: item.name,
        quantity: parseFloat(item.quantity),
        unit: item.unit,
        restaurant_id: item.restaurant_id
    };

    return axios.put(`${API_URL}/${item.ingredient_id}`, ingredientData, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
};

const deleteItem = (id) => {
    const token = getAuthToken();

    return axios.delete(`${API_URL}/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
};

// Điều chỉnh số lượng hàng tồn kho
const adjustQuantity = (id, quantity, reason) => {
    const token = getAuthToken();

    return axios.put(`${API_URL}/${id}/quantity`, { quantity, reason }, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
};

// Lấy lịch sử biến động nguyên liệu
const getIngredientLogs = (ingredientId) => {
    const token = getAuthToken();

    return axios.get(`${API_URL}/${ingredientId}/logs`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
};

export default {
    getAll,
    getById,
    add,
    update,
    delete: deleteItem,
    adjustQuantity,
    getIngredientLogs
};