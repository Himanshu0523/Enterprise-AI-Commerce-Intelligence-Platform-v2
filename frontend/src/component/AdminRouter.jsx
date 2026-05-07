import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const AdminRouter = ({ children }) => {
    const { user , token} = useSelector((state) => state.auth);
    if(!user || !token){
        return <Navigate to="/login" replace />
    }
    if(user.role !== "admin"){
        return <Navigate to="/" replace />
    }
    return children;
};

export default AdminRouter;