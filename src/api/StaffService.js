import axios from 'axios';

const API_URL = 'http://192.168.1.95:8080/api/users';

// Hàm lấy token từ localStorage (hoặc sessionStorage, hoặc state)
const getAuthToken = () => {
    return localStorage.getItem('authToken');  // Hoặc bạn có thể thay đổi nơi lưu trữ token của bạn
};

const getAll = () => {
    const token = getAuthToken();  // Lấy token từ nơi lưu trữ

    // Thêm các tham số phân trang vào URL
    return axios.get(`${API_URL}`, {
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

    // Đảm bảo format của dữ liệu phù hợp với API
    const staffData = {
        name: staff.name,
        email: staff.email,
        password_hash: staff.password || 'default_password', // Cần cung cấp mật khẩu mặc định
        role: staff.role || 'Restaurant', // Vai trò nhân viên nhà hàng
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

const update = (staff) => {
    const token = getAuthToken();  // Lấy token từ nơi lưu trữ

    // Đảm bảo format của dữ liệu phù hợp với API
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

const deleteStaff = (id) => {
    const token = getAuthToken();  // Lấy token từ nơi lưu trữ

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