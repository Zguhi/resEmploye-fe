import axios from 'axios';

const API_URL = 'http://192.168.1.179:8088/api/orders';

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

const getOrderItems = (orderId) => {
    const token = getAuthToken();

    return axios.get(`${API_URL}/${orderId}/items`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
};

const add = (orderData) => {
    const token = getAuthToken();

    return axios.post(API_URL, orderData, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
};

const update = (orderData) => {
    const token = getAuthToken();

    return axios.put(`${API_URL}/${orderData.order_id}`, orderData, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
};

const deleteOrder = (id) => {
    const token = getAuthToken();

    return axios.delete(`${API_URL}/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
};

// Cập nhật trạng thái đơn hàng
const updateStatus = (orderId, status) => {
    const token = getAuthToken();

    return axios.put(`${API_URL}/${orderId}/status`, { status }, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
};

// Thêm món ăn vào đơn hàng
const addOrderItem = (orderId, itemData) => {
    const token = getAuthToken();

    return axios.post(`${API_URL}/${orderId}/items`, itemData, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
};

// Xóa món ăn khỏi đơn hàng
const removeOrderItem = (orderId, itemId) => {
    const token = getAuthToken();

    return axios.delete(`${API_URL}/${orderId}/items/${itemId}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
};

export default {
    getAll,
    getById,
    getOrderItems,
    add,
    update,
    delete: deleteOrder,
    updateStatus,
    addOrderItem,
    removeOrderItem
};