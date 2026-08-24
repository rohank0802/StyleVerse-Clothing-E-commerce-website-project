import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import SellerAccessDenied from "../access denied/SellerAccessDenied.jsx";

const BuyerProtectedRoutes = () => {
    const user = useSelector((state) => state.auth.user)
    const loading = useSelector((state) => state.auth.loading)

    if (loading) {
        return <h1>Loading...</h1>
    }
    if (!user) {
    return <Navigate to="/login" replace/>
    }
if(user.role !== "buyer"){
    return <SellerAccessDenied/>
    }

    return <Outlet/>
}
export default BuyerProtectedRoutes