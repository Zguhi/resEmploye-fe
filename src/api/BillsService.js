import axios from 'axios';
//import {API_BASE_URL} from './axiosConfig.js';

const API_URL = 'http://192.168.1.95:8080/api/orders';

// Hàm lấy token từ localStorage (hoặc sessionStorage, hoặc state)
const getAuthToken = () => {
    return localStorage.getItem('authToken');  // Hoặc bạn có thể thay đổi nơi lưu trữ token của bạn
};

const getAll = () => {
    const token = getAuthToken();  // Lấy token từ nơi lưu trữ

    return axios.get(API_URL, {
        headers: {
            Authorization: `Bearer ${token}`  // Thêm token vào header
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

const add = (bill) => {
    const token = getAuthToken();  // Lấy token từ nơi lưu trữ

    return axios.post(API_URL, bill, {
        headers: {
            Authorization: `Bearer ${token}`  // Thêm token vào header
        }
    });
};

const update = (bill) => {
    const token = getAuthToken();  // Lấy token từ nơi lưu trữ

    return axios.put(`${API_URL}/${bill.order_id}`, bill, {
        headers: {
            Authorization: `Bearer ${token}`  // Thêm token vào header
        }
    });
};

const deleteBill = (id) => {
    const token = getAuthToken();  // Lấy token từ nơi lưu trữ

    return axios.delete(`${API_URL}/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`  // Thêm token vào header
        }
    });
};

// Lấy chi tiết hóa đơn
const getBillDetails = (id) => {
    const token = getAuthToken();

    return axios.get(`${API_URL}/${id}/items`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
};

// Lấy doanh thu theo khoảng thời gian
const getRevenue = (startDate, endDate) => {
    const token = getAuthToken();

    return axios.get(`${API_URL}/revenue`, {
        params: {
            startDate,
            endDate
        },
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

export default {
    getAll,
    getById,
    add,
    update,
    delete: deleteBill,
    getBillDetails,
    getRevenue,
    updateStatus
};