import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import axios from "axios";

const ProtectedRouteManager = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const verifyToken = async () => {
      try {
        const response = await axios.get("http://localhost:3000/auth/verify_user", {
          params: {
            token: token,
          },
        });
        if(response.data.role === 'manager'){
          setIsAuthenticated(true);
        }
      } catch (error) {
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    if (token) {
      verifyToken();
    } else {
      setIsLoading(false);
    }
  }, []);

  if (isLoading) {
    return <div>Loading...</div>; 
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRouteManager;