import { createBrowserRouter } from "react-router-dom";
// import RegisterPage from "../../features/auth/pages/RegisterPage";
// import LoginPage from "../../features/auth/pages/LoginPage";
import {sellerRoutes} from "./seller.route.jsx";
import {buyerRoutes} from "./buyer.routes.jsx";
export const router=createBrowserRouter([
   //  {
   //      path:"/",
   //      element:<h1>hello world</h1>
   //  },
     ...buyerRoutes,
     ...sellerRoutes
])
