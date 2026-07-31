import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const RequireRole = ({ children, allowedRoles }) => {
    const { user } = useSelector((store) => store.auth);

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (!allowedRoles.includes(user.role)) {
        // Redirect according to actual role
        if (user.role === 'recruiter') {
            return <Navigate to="/admin/companies" replace />;
        }
        return <Navigate to="/" replace />;
    }

    return children;
};

export default RequireRole;
