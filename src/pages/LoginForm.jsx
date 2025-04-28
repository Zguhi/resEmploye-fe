import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const LoginForm = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // Tự động set token và thông tin user
        const mockUserData = {
            id: 1,
            name: "Admin",
            email: "admin@example.com",
            role: "Admin"
        };

        // Set mock token và thông tin user
        localStorage.setItem('authToken', 'mock-token-for-testing');
        localStorage.setItem('user', JSON.stringify(mockUserData));

        // Điều hướng về trang chủ
        navigate("/home");
    }, [navigate]);

    return null; // Component này sẽ không render gì cả
};

export default LoginForm;