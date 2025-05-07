import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { authActions } from '../store/auth';
import { useDispatch } from "react-redux";
import axios from 'axios';

const Login = () => {
  const [Values, setValues] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();  

  const change = (e) => {
    const { name, value } = e.target;
    setValues({ ...Values, [name]: value });
  };

  const submit = async () => {
    try {
      if (!Values.email || !Values.password) {
        alert("All fields are required");
        return;
      }

      const response = await axios.post(
        "http://localhost:3000/api/v1/sign-in",
        Values
      );

      const { id, token, role } = response.data;

      dispatch(authActions.login());
      dispatch(authActions.changeRole(role));

      localStorage.setItem("id", id);
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);

      // Redirect based on role
      if (role === 'admin') {
        navigate("/admin-profile");
      } else {
        navigate("/profile");
      }

    } catch (error) {
      alert(error.response?.data?.message || "Login failed");
      console.error("Login error:", error.response?.data || error.message);
    }
  };

  return (
    <div className='h-screen bg-zinc-900 px-12 py-8 flex items-center justify-center'>
      <div className='bg-zinc-800 rounded-lg px-8 py-5 w-full md:w-3/6 lg:w-2/6'>
        <p className='text-zinc-200 text-xl'>Login</p>
        <div className='mt-4'>
          <div>
            <label className='text-zinc-400'>Email</label>
            <input type="email" 
              className='w-full mt-2 bg-zinc-900 text-zinc-100 p-2 outline-none' 
              placeholder='email' 
              name='email' 
              value={Values.email}
              onChange={change}
            />
          </div>

          <div className='mt-4'>
            <label className='text-zinc-400'>Password</label>
            <input type='password' 
              className='w-full mt-2 bg-zinc-900 text-zinc-100 p-2 outline-none' 
              placeholder='password' 
              name='password' 
              value={Values.password}
              onChange={change}
            />
          </div>

          <div className='mt-4'>
            <button 
              className='w-full bg-blue-500 text-white font-semibold py-2 rounded hover:bg-blue-600 transition-all duration-300'
              onClick={submit}
            >
              Log In
            </button>
          </div>

          <p className='flex mt-4 items-center justify-center text-zinc-200 font-semibold'>
            Or
          </p>
          <p className='flex mt-4 items-center justify-center text-zinc-500 font-semibold'>
            Don't have an account? &nbsp;
            <Link to="/signup" className='hover:text-blue-500'>
              <u>Sign Up</u>
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
