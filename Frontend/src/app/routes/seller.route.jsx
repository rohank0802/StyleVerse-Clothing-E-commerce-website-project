import SellerLoginPage from "../../features/auth/pages/SellerPages/SellerLoginPage.jsx";
import SellerRegisterPage from "../../features/auth/pages/SellerPages/SellerRegisterPage.jsx";
import SellerProtectedRoutes from "../../features/auth/protectedComponents/SellerProtectedRoutes.jsx";
import { Link } from "react-router-dom";
import CreateProduct from "../../features/products/pages/sellerPage/CreateProduct.jsx";
import SellerDashboard from "../../features/Dashboard/SellerDashboard.jsx";
import SellerProductDetail from "../../features/products/pages/sellerPage/SellerProductDetail.jsx";
export const sellerRoutes=[
    {
        path:"/seller/login",
        element:<SellerLoginPage/>
    },
    {
        path:"/seller/register",
        element:<SellerRegisterPage/>
    },
    {
        element:<SellerProtectedRoutes/>,
        children:[
            {
                path:"/seller/dashboard",
                element:<SellerDashboard/>
            },
            {
                path:"/seller/verify-email",
                element:<h1>seller regestrition seccessfull .please verify you email before login.varification link is sended on your registered email. <Link to="/seller/login" className="text-indigo-600 cursor-pointer hover:underline">Go on login page</Link></h1>
            },
            {
                path:"/seller/create-product",
                element:<CreateProduct/>
            },
            {
                path:"/seller/product/:productId",
             element:<SellerProductDetail/>
            }
           
        ]
    }
]
