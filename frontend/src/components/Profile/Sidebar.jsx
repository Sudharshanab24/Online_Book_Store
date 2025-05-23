import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaArrowRightFromBracket } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { authActions } from "../../store/auth";

const Sidebar = ({ data }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const role = useSelector((state) => state.auth.role);

  const handleLogout = () => {
    dispatch(authActions.logout());
    dispatch(authActions.changeRole("user"));
    localStorage.removeItem("id");
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/");
  };

  const isAdmin = data.username === "admin";

  return (
    <div className="bg-zinc-800 fixed top-0 left-0 h-screen w-[240px] z-10 flex items-center justify-center p-4 overflow-y-auto shadow-lg">
      <div className="flex flex-col items-center w-full">
        {/* User Info */}
        <img src={data.avatar} className="h-[12vh] rounded-full" alt="User Avatar" />
        <p className="mt-3 text-xl text-zinc-100 font-semibold">{data.username}</p>
        <p className="mt-1 text-sm text-zinc-300 text-center px-2">{data.email}</p>

        <div className="w-full mt-4 h-[1px] bg-zinc-500"></div>

        {/* Navigation */}
        <div className="w-full mt-4 flex flex-col items-center justify-center">
          {!isAdmin && (
            <>
              <Link
                to="/profile"
                className="text-zinc-100 font-semibold w-full py-2 text-center hover:bg-zinc-900 rounded transition-all duration-300"
              >
                Favorites
              </Link>
              <Link
                to="/profile/OrderHistory"
                className="text-zinc-100 font-semibold w-full py-2 mt-2 text-center hover:bg-zinc-900 rounded transition-all duration-300"
              >
                Order History
              </Link>
              <Link
                to="/profile/settings"
                className="text-zinc-100 font-semibold w-full py-2 mt-2 text-center hover:bg-zinc-900 rounded transition-all duration-300"
              >
                Settings
              </Link>
            </>
          )}

          {role === "admin" && (
            <>
              <Link
                to="/profile"
                className="text-zinc-100 font-semibold w-full py-2 text-center hover:bg-zinc-900 rounded transition-all duration-300"
              >
                All Orders
              </Link>
              <Link
                to="/profile/add-book"
                className="text-zinc-100 font-semibold w-full py-2 mt-2 text-center hover:bg-zinc-900 rounded transition-all duration-300"
              >
                Add Book
              </Link>
            </>
          )}
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="bg-zinc-900 w-3/4 mt-6 text-white font-semibold flex items-center justify-center py-2 rounded hover:bg-white hover:text-zinc-900 transition-all duration-300"
        >
          Log Out <FaArrowRightFromBracket className="ml-2" />
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
