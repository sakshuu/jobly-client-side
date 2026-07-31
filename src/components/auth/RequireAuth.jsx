import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';

const RequireAuth = ({ children }) => {
    const { user } = useSelector((store) => store.auth);
    const location = useLocation();

    if (!user) {
        // Redirect to login page while saving the attempted url location
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children;
};

export default RequireAuth;
