import axios from 'axios';

// URL gốc của API backend
export const API_BASE_URL = 'http://192.168.1.95:8088'; // Đã cập nhật theo URL trong code của bạn

// Tạo một instance của axios
const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    }
});

// Interceptor để thêm token JWT vào header trước mỗi request
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('authToken');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Interceptor xử lý response
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // Xử lý lỗi 401 (Unauthorized)
        if (error.response && error.response.status === 401) {
            localStorage.removeItem('authToken');
            localStorage.removeItem('user');
            // Có thể chuyển hướng đến trang đăng nhập ở đây
            window.location.href = '/';
        }
        return Promise.reject(error);
    }
);

export default api;