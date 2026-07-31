import React from 'react';
import RequireRole from '../auth/RequireRole';

const ProtectedRoute = ({ children }) => {
    return <RequireRole allowedRoles={['recruiter']}>{children}</RequireRole>;
};

export default ProtectedRoute;