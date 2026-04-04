import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../store';

interface Props {
  allowedRoles: string[]; 
}

const ProtectedRoute = ({ allowedRoles }: Props) => {
  const { token, user } = useSelector((state: RootState) => state.auth);
  const location = useLocation();

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (user && !allowedRoles.includes(user.role)) {
    return <Navigate to={user.role === 'ADMIN' ? "/admin" : "/"} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;