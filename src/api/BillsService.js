import axios from 'axios';

const API_URL = '${API_BASE_URL}/api/orders';

// Hàm lấy token từ localStorage
// const getAuthToken = () => {
//     return localStorage.getItem('authToken');
// };

// Lấy tất cả hóa đơn
const getAll = () => {
    //const token = getAuthToken();

    return axios.get(API_URL, {
        withCredentials: true,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    });
};

// Lấy hóa đơn theo ID
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

// Lấy chi tiết hóa đơn (các mục trong hóa đơn)
const getBillDetails = (orderId) => {
    //const token = getAuthToken();

    return axios.get(`${API_URL}/${orderId}/items`, {
        withCredentials: true,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    });
};

// Thêm hóa đơn mới
const add = (billData) => {
    //const token = getAuthToken();

    const processedBillData = {
        userId: billData.userId,
        tableId: billData.tableId,
        items: billData.items.map(item => ({
            dishId: item.dishId,
            quantity: item.quantity
        }))
    };

    return axios.post(API_URL, processedBillData, {
        withCredentials: true,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    });
};

// Cập nhật hóa đơn
const update = (billData) => {
    //const token = getAuthToken();

    const processedBillData = {
        orderId: billData.orderId || billData.order_id,
        tableId: billData.tableId,
        items: billData.items.map(item => ({
            dishId: item.dishId,
            quantity: item.quantity
        }))
    };

    return axios.put(`${API_URL}/${processedBillData.orderId}`, processedBillData, {
        withCredentials: true,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    });
};

// Xóa hóa đơn
const deleteBill = (id) => {
    //const token = getAuthToken();

    return axios.delete(`${API_URL}/${id}`, {
        withCredentials: true,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    });
};

// Cập nhật trạng thái hóa đơn
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

// Lấy doanh thu theo khoảng thời gian
const getRevenue = (startDate, endDate) => {
    //const token = getAuthToken();

    return axios.get(`${API_URL}/revenue`, {
        params: { startDate, endDate },
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
    getBillDetails,
    add,
    update,
    delete: deleteBill,
    updateStatus,
    getRevenue
};