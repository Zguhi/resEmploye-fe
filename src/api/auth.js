import axios from 'axios';

const API_URL = "http://192.168.1.95:8080/api/auth/login";

export const login = async (email, password) => {
    try {
        const response = await axios.post(API_URL,
            { email, password },
            {
                headers: {
                    'Content-Type': 'application/json',
                },
                withCredentials: false
            }
        );

        const data = response.data;

        if (data && data.token) {
            localStorage.setItem('authToken', data.token);

            if (data.user) {
                localStorage.setItem('user', JSON.stringify(data.user));
            }
        }

        return data;
    } catch (error) {
        console.error("Lỗi đăng nhập:", error);

        if (error.response) {
            throw new Error(error.response.data.message || "Đăng nhập thất bại");
        } else if (error.request) {
            throw new Error("Không thể kết nối tới server");
        } else {
            throw error;
        }
    }
};

export const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
};

export const getCurrentUser = () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
};

export const isAuthenticated = () => {
    return !!localStorage.getItem('authToken');
};

// Kiểm tra token hết hạn
export const isTokenExpired = () => {
    const token = localStorage.getItem('authToken');
    if (!token) return true;

    try {
        // Phân tách payload từ token
        const payload = JSON.parse(atob(token.split('.')[1]));
        // Kiểm tra thời gian hết hạn
        return payload.exp < Date.now() / 1000;
    } catch (error) {
        return true;
    }
};