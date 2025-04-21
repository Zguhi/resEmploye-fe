import axios from 'axios';

const API_URL = 'http://192.168.1.179:8088/api/bills';

// Hàm lấy token từ localStorage (hoặc sessionStorage, hoặc state)
const getAuthToken = () => {
    return localStorage.getItem('authToken');  // Hoặc bạn có thể thay đổi nơi lưu trữ token của bạn
};

const getAll = (page = 0, limit = 10, sortBy = 'id', order = 'asc') => {
    const token = getAuthToken();  // Lấy token từ nơi lưu trữ

    return axios.get(API_URL, {
        params: {
            page,
            limit,
            sortBy,
            order
        },
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

    return axios.put(`${API_URL}/${bill.id}`, bill, {
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

    return axios.get(`${API_URL}/${id}/details`, {
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

export default {
    getAll,
    getById,
    add,
    update,
    delete: deleteBill,
    getBillDetails,
    getRevenue
};