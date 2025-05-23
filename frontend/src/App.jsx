import React, { useEffect } from 'react'
import Home from './pages/Home'
import Navbar from './components/Navbar/Navbar'
import Footer from './components/Footer/Footer'
import { Routes, Route } from "react-router-dom";
import AllBooks from './pages/AllBooks';
import LogIn from './pages/LogIn';
import SignUp from './pages/SignUp';
import Cart from './pages/Cart';
import Profile from './pages/Profile';
import AboutUs from './pages/AboutUs';
import ViewBookDetails from './components/ViewBookDetails/ViewBookDetails';
import { useDispatch, useSelector } from "react-redux";
import { authActions } from "./store/auth";
import Favourites from './components/Profile/Favourites';
import OrderHistory from './components/Profile/OrderHistory';
import Settings from './components/Profile/Settings';
import AllOrders from './pages/AllOrders';
import AddBooks from './pages/AddBooks';
import UpdateBook from './pages/UpdateBook';
import UserDetails from "./pages/UserDetails";

// Import toast container and styles
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  const dispatch = useDispatch();
  const role = useSelector((state) => state.auth.role);
  
  useEffect(() => {
    if(
      localStorage.getItem("id") &&
      localStorage.getItem("token") &&
      localStorage.getItem("role")
    ) {
      dispatch(authActions.login());
      dispatch(authActions.changeRole(localStorage.getItem("role")));
    }
  }, []);
    
  return (
    <div className="bg-black">
      <Navbar />
      <Routes>
        <Route exact path="/" element={<Home/>}/>
        <Route path="/about-us" element={<AboutUs/>}/>
        <Route path="/all-books" element={<AllBooks/>}/>
        <Route path="/cart" element={<Cart/>}/>
        <Route path="/profile" element={<Profile/>}>
          {role === "user" ? (<Route index element={<Favourites/>}/>) : (<Route index element={<AllOrders/>}/>)}
          {role === "admin" && (<Route path="/profile/add-book" element={<AddBooks/>}/>)}
          <Route path="/profile/OrderHistory" element={<OrderHistory/>}/>
          <Route path="/profile/Settings" element={<Settings/>}/>
        </Route>
        <Route path="/user/:userId" element={<UserDetails />} />
        <Route path="/SignUp" element={<SignUp/>}/>
        <Route path="/LogIn" element={<LogIn/>}/>
        <Route path="/updateBook/:id" element={<UpdateBook/>}/>
        <Route path="/view-book-details/:id" element={<ViewBookDetails/>}/>
      </Routes>
      <Footer />
      
      {/* Add ToastContainer for notifications */}
      <ToastContainer 
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  )
}

export default App