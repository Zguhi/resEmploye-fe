import axios from 'axios';

const API_URL = 'http://192.168.1.137:8080/api/orders';

// Hàm lấy token từ localStorage
const getAuthToken = () => {
    return localStorage.getItem('authToken');
};

// Lấy tất cả hóa đơn
const getAll = (page = 0, size = 10, sortBy = 'orderId', sortDir = 'desc') => {
    const token = getAuthToken();

    return axios.get(API_URL, {
        params: { page, size, sortBy, sortDir },
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
};

// Lấy hóa đơn theo ID
const getById = (id) => {
    const token = getAuthToken();

    return axios.get(`${API_URL}/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
};

// Lấy chi tiết hóa đơn (các mục trong hóa đơn)
const getBillDetails = (orderId) => {
    const token = getAuthToken();

    return axios.get(`${API_URL}/${orderId}/items`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
};

// Thêm hóa đơn mới
const add = (billData) => {
    const token = getAuthToken();

    const processedBillData = {
        userId: billData.userId,
        tableId: billData.tableId,
        items: billData.items.map(item => ({
            dishId: item.dishId,
            quantity: item.quantity
        }))
    };

    return axios.post(API_URL, processedBillData, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
};

// Cập nhật hóa đơn
const update = (billData) => {
    const token = getAuthToken();

    const processedBillData = {
        orderId: billData.orderId || billData.order_id,
        tableId: billData.tableId,
        items: billData.items.map(item => ({
            dishId: item.dishId,
            quantity: item.quantity
        }))
    };

    return axios.put(`${API_URL}/${processedBillData.orderId}`, processedBillData, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
};

// Xóa hóa đơn
const deleteBill = (id) => {
    const token = getAuthToken();

    return axios.delete(`${API_URL}/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
};

// Cập nhật trạng thái hóa đơn
const updateStatus = (orderId, status) => {
    const token = getAuthToken();

    return axios.patch(`${API_URL}/${orderId}/status`, { status }, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
};

// Lấy doanh thu theo khoảng thời gian
const getRevenue = (startDate, endDate) => {
    const token = getAuthToken();

    return axios.get(`${API_URL}/revenue`, {
        params: { startDate, endDate },
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
};

export default {
    getAll,
    getById,
    getBillDetails,
    add,
    update,
    delete: deleteBill,
    updateStatus,
    getRevenue
};