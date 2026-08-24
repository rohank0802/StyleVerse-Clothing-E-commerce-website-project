import { Link } from "react-router-dom";
import LoginPage from "../../features/auth/pages/buyerPages/LoginPage.jsx";
import RegisterPage from "../../features/auth/pages/buyerPages/RegisterPage.jsx";
import BuyerProtectedRoutes from "../../features/auth/protectedComponents/BuyerProtectedRoute.jsx";
import BuyerLayout from "../../features/products/pages/buyerPage/BuyerLayout.jsx";
import BuyerDashboard from "../../features/Dashboard/BuyerDashboard.jsx";
import ProductDetail from "../../features/products/pages/buyerPage/ProductDetail.jsx";
import CartPage from "../../features/cart/pages/CartPage.jsx";
import OrderSuccess from "../../features/cart/pages/OrderSuccess.jsx";
import ShowSearchedproducts from "../../features/products/pages/buyerPage/ShowSearchedproducts.jsx"
export const buyerRoutes = [
    {
        element: <BuyerLayout />,
        children: [
            {
                path: "/",
                element: <BuyerDashboard />
            },
            {
                path:"/products/:productId",
                element:<ProductDetail/>
            },
            {
                path:"/SeachPoduct",
                element:<ShowSearchedproducts/>
            },
            // Buyer Protected pages
            {
                element: <BuyerProtectedRoutes />,
                children: [
                    {
                        path: "/buyer/verify-email",
                        element: (
                            <h1 className="p-8 text-center text-white">
                                Registration successful. Please verify your email before login. Verification link sent to your registered email.{' '}
                                <Link to="/login" className="text-indigo-400 cursor-pointer underline">
                                    Go to login page
                                </Link>
                            </h1>
                        )
                    },
                    {
                        path:"/buyer/cart",
                        element:<CartPage/>
                    },
                    {
                        path:"/OrderPaySuccess",
                        element:<OrderSuccess/>
                    }
                ]
            }
        ]
    },

    // Pages without navbar and footer
    {
        path: "/login",
        element: <LoginPage />
    },
    {
        path: "/register",
        element: <RegisterPage />
    }
]