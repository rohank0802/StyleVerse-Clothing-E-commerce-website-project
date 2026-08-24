import { Outlet,Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import BuyerAccessDenied from "../access denied/BuyerAccessDenied.jsx";
const SellerProtectedRoutes=()=>{
    const user=useSelector((state)=>state.auth.user)
    const loading=useSelector((state)=>state.auth.loading)
if(loading){
        return <h1>Loading...</h1>
    }
if(!user){
    return <Navigate to="/seller/login" replace/>
    }
if(user.role !== "seller"){
    return <BuyerAccessDenied/>
    }
return <Outlet/>
}
export default SellerProtectedRoutes