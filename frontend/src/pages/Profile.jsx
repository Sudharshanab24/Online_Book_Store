import React, { useEffect, useState } from 'react';
import Sidebar from "../components/Profile/Sidebar";
import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import Loader from "../components/Loader/Loader";
import axios from "axios";

const Profile = () => {
  const [profile, setProfile] = useState(null); // Renamed state to 'profile'

  const headers = {
    id: localStorage.getItem("id"),
    authorization: `Bearer ${localStorage.getItem("token")}`,
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // Check if the necessary tokens are available
        if (!headers.id || !headers.authorization) {
          console.error("User ID or token is missing.");
          return;
        }

        const response = await axios.get("http://localhost:3000/api/v1/get-user-information", { headers });
        console.log(response.data);
        setProfile(response.data); // Updated to setProfile with response data
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };
    
    fetchProfile();
  }, []); // This will run only once when the component mounts

  return (
    <div className="bg-zinc-900 min-h-screen px-2 md:px-12 flex flex-col md:flex-row py-8 gap-4 text-white">
      {!profile ? (
        <div className="w-full h-full flex items-center justify-center">
          <Loader /> {/* Show loading indicator */}
        </div>
      ) : (
        <>
          <div className="w-full md:w-1/6">
            <Sidebar data={profile} /> {/* Pass profile data to Sidebar */}
          </div>
          <div className="w-full md:w-5/6">
            <Outlet /> {/* Render nested routes */}
          </div>
        </>
      )}
    </div>
  );
};

export default Profile;
