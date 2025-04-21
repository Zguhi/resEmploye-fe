// src/components/ProtectedRoute.jsx - Luôn cho phép truy cập
import React from 'react';

const ProtectedRoute = ({ children }) => {
    // Luôn trả về children, bỏ qua việc kiểm tra xác thực
    return children;
};

export default ProtectedRoute;