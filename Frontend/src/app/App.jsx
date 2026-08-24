import { RouterProvider } from 'react-router-dom'
import { router } from './routes/App.routes.jsx'
import './App.css'
import { useAuth } from "../features/auth/hook/useAuth.js"
import { useEffect } from 'react'
import {useSellerAuth} from "../features/auth/hook/useSellerAuth.js"
function App() {
  const path=window.location.pathname
  const getMe=useAuth()
  const getSellerMe=useSellerAuth()
useEffect(()=>{
if(path.includes("/seller")){
  getSellerMe.handleSellergetMeUser()
}else{
getMe.handlegetMeUser()
}


},[])
  return (
    <>
      <RouterProvider router={router}/>
    </>
  )
}

export default App
