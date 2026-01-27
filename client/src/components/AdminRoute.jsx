import { Navigate, Outlet } from 'react-router-dom';
import useAuthStore from '../store/authStore';

const AdminRoute = () => {
    const { userInfo } = useAuthStore();
    return userInfo && userInfo.role === 'admin' ? <Outlet /> : <Navigate to="/" replace />;
};

export default AdminRoute;
