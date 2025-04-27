import axios from 'axios';

// Địa chỉ API - cập nhật URL này theo cấu hình server của bạn
const API_URL = 'http://192.168.1.137:8080/api/users';

// Hàm lấy token từ localStorage
const getAuthToken = () => {
    return localStorage.getItem('authToken');
};

// Hàm lấy tất cả nhân viên
const getAll = () => {
    const token = getAuthToken();

    console.log('Gọi API với URL:', API_URL);
    console.log('Token tồn tại:', token ? 'Có' : 'Không');

    return axios.get(API_URL, {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        timeout: 10000,
    });
};

// Hàm lấy thông tin nhân viên theo ID
const getById = (id) => {
    const token = getAuthToken();
    return axios.get(`${API_URL}/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
};

// Hàm thêm nhân viên mới
const add = (staff) => {
    const token = getAuthToken();

    // Chuyển đổi dữ liệu để phù hợp với API
    const staffData = {
        name: staff.name,
        email: staff.email,
        password_hash: staff.password || 'default_password',
        role: staff.role || 'Restaurant',
        phone_number: staff.phone,
        address: staff.address
    };

    return axios.post(API_URL, staffData, {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });
};

// Hàm cập nhật thông tin nhân viên
const update = (staff) => {
    const token = getAuthToken();

    const staffData = {
        user_id: staff.user_id || staff.id,
        name: staff.name,
        email: staff.email,
        phone_number: staff.phone_number,
        address: staff.address,
        role: staff.role || 'Restaurant'
    };

    return axios.put(`${API_URL}/${staffData.user_id}`, staffData, {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });
};

// Hàm xóa nhân viên
const deleteStaff = (id) => {
    const token = getAuthToken();
    return axios.delete(`${API_URL}/${id}`, {
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
    delete: deleteStaff
};