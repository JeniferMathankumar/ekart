import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom'
function ProtectedRoute({ children, allowedRoles }) {
    const { token, role } = useSelector((state) => state.profile);

    if (!allowedRoles.includes(role)) {

        if (role === "ADMIN") {
            return <Navigate to="/admin/dashboard" replace />;
        }

        return <Navigate to="/" replace />;
    }
    return children;
}
export default ProtectedRoute;