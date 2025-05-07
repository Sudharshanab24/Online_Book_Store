import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaGripLines } from "react-icons/fa";
import { useSelector } from 'react-redux';


const Navbar = () => {
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const role = useSelector((state) => state.auth.role);

  // Build the navigation links based on login and role
  let filteredLinks = [
    { title: "Home", link: "/" },
    { title: "All Books", link: "/all-books" },
  ];

  if (isLoggedIn && role === "user") {
    filteredLinks.push(
      { title: "Cart", link: "/cart" },
      { title: "Profile", link: "/profile" }
    );
  }

  if (isLoggedIn && role === "admin") {
    filteredLinks.push({ title: "Admin Profile", link: "/profile" });
  }

  const [mobileNavVisible, setMobileNavVisible] = useState(false);

  return (
    <>
      <nav className='z-50 relative flex bg-zinc-800 text-white px-8 py-4 items-center justify-between'>
        <Link className='flex items-center'>
          <img
            className='h-10 me-4'
            src="https://cdn-icons-png.flaticon.com/128/10433/10433049.png"
            alt="logo"
          />
          <h1 className="text-2xl font-semibold">GOODLUCK ENTERPRISES</h1>
        </Link>
        <div className='nav-links-bookheaven block md:flex items-center gap-4'>
          <div className='hidden md:flex gap-4'>
            {filteredLinks.map((item, i) => (
              <div className='flex items-center justify-center' key={i}>
                {(item.title === "Profile" || item.title === "Admin Profile") ? (
                  <Link
                    to={item.link}
                    className='px-2 py-1 border border-blue-500 rounded hover:bg-white hover:text-zinc-800 transition-all duration-300'
                  >
                    {item.title}
                  </Link>
                ) : (
                  <Link
                    to={item.link}
                    className="hover:text-blue-500 transition-all duration-300"
                  >
                    {item.title}
                  </Link>
                )}
              </div>
            ))}
          </div>

          {!isLoggedIn && (
            <div className='hidden md:flex gap-4'>
              <Link
                to="/LogIn"
                className='px-2 py-1 border border-blue-500 rounded hover:bg-white hover:text-zinc-800 transition-all duration-300'>
                LogIn
              </Link>
              <Link
                to="/SignUp"
                className='px-2 py-1 bg-blue-500 rounded hover:bg-white hover:text-zinc-800 transition-all duration-300'>
                SignUp
              </Link>
            </div>
          )}

          <button
            className='block md:hidden text-white text-2xl hover:text-zinc-400'
            onClick={() => setMobileNavVisible(!mobileNavVisible)}
          >
            <FaGripLines />
          </button>
        </div>
      </nav>

      {mobileNavVisible && (
        <div className='bg-zinc-800 h-screen absolute top-0 left-0 w-full z-40 flex flex-col items-center justify-center'>
          {filteredLinks.map((item, i) => (
            <Link
              to={item.link}
              className="text-white text-4xl mb-8 font-semibold hover:text-blue-500 transition-all duration-300"
              key={i}
              onClick={() => setMobileNavVisible(false)}
            >
              {item.title}
            </Link>
          ))}

          {!isLoggedIn && (
            <>
              <Link
                to="/LogIn"
                className='px-8 mb-8 text-3xl font-semibold py-2 border border-blue-500 rounded text-white hover:bg-white hover:text-zinc-800 transition-all duration-300'>
                LogIn
              </Link>
              <Link
                to="/SignUp"
                className='px-8 mb-8 text-3xl font-semibold py-2 bg-blue-500 rounded hover:bg-white hover:text-zinc-800 transition-all duration-300'>
                SignUp
              </Link>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default Navbar;
