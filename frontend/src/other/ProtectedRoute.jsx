import { useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import { Navigate } from "react-router-dom";
// import { toast } from "react-toastify";

const ProtectedRoute = ({ children }) => {
    const { token } = useContext(ShopContext);

    if (!token) {
        return   <Navigate to="/login" />;
    
    }

    return children;
};

export default ProtectedRoute;
