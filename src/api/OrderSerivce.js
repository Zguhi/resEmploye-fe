import axios from 'axios';

const API_URL = '${API_BASE_URL}/api/orders';

// Hàm lấy token từ localStorage
const getAuthToken = () => {
    return localStorage.getItem('authToken');
};

// Lấy tất cả đơn hàng
const getAll = (page = 0, size = 10, sortBy = 'orderId', sortDir = 'desc') => {
    const token = getAuthToken();

    return axios.get(API_URL, {
        params: { page, size, sortBy, sortDir },
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
};

// Lấy đơn hàng theo ID
const getById = (id) => {
    const token = getAuthToken();

    return axios.get(`${API_URL}/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
};

// Lấy các mục trong đơn hàng
const getOrderItems = (orderId) => {
    const token = getAuthToken();

    return axios.get(`${API_URL}/${orderId}/items`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
};

// Tạo đơn hàng mới
const add = (orderData) => {
    const token = getAuthToken();

    // Cấu trúc dữ liệu phù hợp với OrderRequest
    const processedOrderData = {
        userId: orderData.userId,
        tableId: orderData.tableId,
        items: orderData.items.map(item => ({
            dishId: item.dishId,
            quantity: item.quantity
        }))
    };

    return axios.post(API_URL, processedOrderData, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
};

// Cập nhật đơn hàng
const update = (orderData) => {
    const token = getAuthToken();

    const processedOrderData = {
        orderId: orderData.orderId || orderData.order_id,
        tableId: orderData.tableId,
        items: orderData.items.map(item => ({
            dishId: item.dishId,
            quantity: item.quantity
        }))
    };

    return axios.put(`${API_URL}/${processedOrderData.orderId}`, processedOrderData, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
};

// Xóa đơn hàng
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

    return axios.patch(`${API_URL}/${orderId}/status`, { status }, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
};

// Thêm mục vào đơn hàng
const addOrderItem = (orderId, itemData) => {
    const token = getAuthToken();

    return axios.post(`${API_URL}/${orderId}/items`, itemData, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
};

// Xóa mục khỏi đơn hàng
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