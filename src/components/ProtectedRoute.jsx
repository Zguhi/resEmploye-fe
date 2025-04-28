import React from 'react';
import { Navigate } from 'react-router-dom';
import { isAuthenticated } from '../api/auth';

const ProtectedRoute = ({ children }) => {
    const authenticated = isAuthenticated();

    if (!authenticated) {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;