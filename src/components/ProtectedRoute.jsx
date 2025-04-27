// src/components/ProtectedRoute.jsx
// eslint-disable import/no-extraneous-dependencies
import React from 'react';
import { Navigate } from 'react-router-dom';
import { isAuthenticated } from '../api/auth';

const ProtectedRoute = ({ children }) => {
    // Kiểm tra người dùng đã đăng nhập hay chưa
    const authenticated = isAuthenticated();

    if (!authenticated) {
        // Nếu chưa đăng nhập, chuyển hướng về trang login
        return <Navigate to="/" replace />;
    }

    // Nếu đã đăng nhập, cho phép truy cập vào route
    return children;
};

export default ProtectedRoute;