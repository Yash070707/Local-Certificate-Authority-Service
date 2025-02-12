import { useAuth } from '../contexts/AuthContext';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ allowedRoles }) => {
  const { token, role } = useAuth();

  if (!token) return <Navigate to="/login" />;
  if (!allowedRoles.includes(role)) return <Navigate to="/" />;

  return <Outlet />;
};

export default ProtectedRoute;