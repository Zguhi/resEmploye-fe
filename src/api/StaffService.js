import axios from 'axios';

const API_URL = 'http://192.168.1.179:8088/api/staff';

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

const add = (staff) => {
    const token = getAuthToken();  // Lấy token từ nơi lưu trữ

    return axios.post(API_URL, staff, {
        headers: {
            Authorization: `Bearer ${token}`  // Thêm token vào header
        }
    });
};

const update = (staff) => {
    const token = getAuthToken();  // Lấy token từ nơi lưu trữ

    return axios.put(`${API_URL}/${staff.id}`, staff, {
        headers: {
            Authorization: `Bearer ${token}`  // Thêm token vào header
        }
    });
};

const deleteStaff = (id) => {
    const token = getAuthToken();  // Lấy token từ nơi lưu trữ

    return axios.delete(`${API_URL}/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`  // Thêm token vào header
        }
    });
};

export default {
    getAll,
    getById,
    add,
    update,
    delete: deleteStaff
};