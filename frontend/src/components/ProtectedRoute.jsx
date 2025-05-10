
// frontend/src/components/ProtectedRoute.jsx

import { useAuth } from '../contexts/AuthContext';
import { Navigate, Outlet } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

const ProtectedRoute = ({ allowedRoles }) => {
  const { token, role } = useAuth();
  const location = useLocation();

  // If not authenticated, redirect to login with the current path as state
  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If role is not defined or not in allowedRoles, redirect based on role
  if (!role || !allowedRoles.includes(role)) {
    // Redirect non-admins to /user, admins to /admin
    const redirectTo = role === 'admin' ? '/admin' : '/user';
    return <Navigate to={redirectTo} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
