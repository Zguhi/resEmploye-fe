import axios from 'axios';
import {API_BASE_URL} from "./axiosConfig.js";

const API_URL = `${API_BASE_URL}/api/orders`;

// Hàm lấy token từ localStorage
// const getAuthToken = () => {
//     return localStorage.getItem('authToken');
// };

// Lấy tất cả đơn hàng
const getAll = () => {
    // const token = getAuthToken()
    return axios.get(API_URL, {
        withCredentials: true,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    });
};

// Lấy đơn hàng theo ID
const getById = (id) => {
    //const token = getAuthToken();

    return axios.get(`${API_URL}/${id}`, {
        withCredentials: true,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    });
};

// Lấy các mục trong đơn hàng
const getOrderItems = (orderId) => {
    //const token = getAuthToken();

    return axios.get(`${API_URL}/${orderId}/items`, {
        withCredentials: true,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    });
};

// Tạo đơn hàng mới
// const add = (orderData) => {
//     //const token = getAuthToken();
//
//     // Cấu trúc dữ liệu phù hợp với OrderRequest
//     const processedOrderData = {
//         userId: orderData.userId,
//         tableId: orderData.tableId,
//         items: orderData.items.map(item => ({
//             dishId: item.dishId,
//             quantity: item.quantity
//         }))
//     };
//
//     return axios.post(API_URL, processedOrderData, {
//         withCredentials: true,
//         headers: {
//             'Accept': 'application/json',
//             'Content-Type': 'application/json'
//         }
//     });
// };

// Cập nhật đơn hàng
const update = (orderData) => {
    //const token = getAuthToken();

    const processedOrderData = {
        orderId: orderData.orderId || orderData.order_id,
        tableId: orderData.tableId,
        items: orderData.items.map(item => ({
            dishId: item.dishId,
            quantity: item.quantity
        }))
    };

    return axios.put(`${API_URL}/${processedOrderData.orderId}`, processedOrderData, {
        withCredentials: true,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    });
};

// Xóa đơn hàng
const deleteOrder = (id) => {
    //const token = getAuthToken();

    return axios.delete(`${API_URL}/${id}`, {
        withCredentials: true,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    });
};

// Cập nhật trạng thái đơn hàng
const updateStatus = (orderId, status) => {
    //const token = getAuthToken();

    return axios.patch(`${API_URL}/${orderId}/status`, { status }, {
        withCredentials: true,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    });
};

// Thêm mục vào đơn hàng
const addOrderItem = (orderId, itemData) => {
    //const token = getAuthToken();

    return axios.post(`${API_URL}/${orderId}/items`, itemData, {
        withCredentials: true,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    });
};

// Xóa mục khỏi đơn hàng
const removeOrderItem = (orderId, itemId) => {
    //const token = getAuthToken();

    return axios.delete(`${API_URL}/${orderId}/items/${itemId}`, {
        withCredentials: true,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    });
};

export default {
    getAll,
    getById,
    getOrderItems,
    update,
    delete: deleteOrder,
    updateStatus,
    addOrderItem,
    removeOrderItem
};