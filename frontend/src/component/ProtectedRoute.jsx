import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
    const { user, token } = useSelector((state) => state.auth);

    if (!user || !token) {
        return <Navigate to="/login" />;
    }

    return children;
}

export default ProtectedRoute;