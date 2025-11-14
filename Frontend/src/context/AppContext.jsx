import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const AppContext = createContext();

const AppContextProvider = (props) => {
  const currencySymbol = "$";
  const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
  const [isLoading, setIsLoading] = useState(false);
  console.log("isLoading:", isLoading);
  const [doctors, setDoctors] = useState([]);
  const [token, setToken] = useState(
    localStorage.getItem("token") ? localStorage.getItem("token") : ""
  );
  const [userData, setUserData] = useState(false);
  const getDoctorsData = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/doctor/list");

      if (data.success) {
        setDoctors(data.doctors);
      }
    } catch (error) {
      console.log("error:", error);
      toast.error(error.message);
    }
  };

  const loadUserProfileData = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/user/get-profile", {
        headers: { token },
      });

      if (data.success) {
        setUserData(data.userData);
      } else {
        // Handle JWT errors silently - clear token if malformed or invalid
        if (data.message && (data.message.toLowerCase().includes('jwt') || data.message.toLowerCase().includes('malformed') || data.message.toLowerCase().includes('unauthorized'))) {
          localStorage.removeItem("token");
          setToken("");
          setUserData(false);
          return;
        }
        toast.error(data.message);
      }
    } catch (error) {
      console.log("error:", error);
      // Handle JWT errors silently - clear token if malformed or invalid
      const errorMessage = error.response?.data?.message || error.message || "";
      if (errorMessage.toLowerCase().includes('jwt') || errorMessage.toLowerCase().includes('malformed') || errorMessage.toLowerCase().includes('unauthorized')) {
        localStorage.removeItem("token");
        setToken("");
        setUserData(false);
        return;
      }
      toast.error(error.message);
    }
  };
  useEffect(() => {
    getDoctorsData();
  }, []);

  useEffect(() => {
    if (token) {
      loadUserProfileData();
    } else {
      setUserData(false);
    }
  }, [token]);

  useEffect(() => {
    // request intercepter
    console.log("inter");
    axios.interceptors.request.use(
      (config) => {
        setIsLoading(true);
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );
    //response intercepter
    axios.interceptors.response.use(
      (config) => {
        setIsLoading(false);
        return config;
      },
      (error) => {
        setIsLoading(false);
        // Handle JWT errors globally - clear token if malformed or invalid
        const errorMessage = error.response?.data?.message || error.message || "";
        if (errorMessage.toLowerCase().includes('jwt') || errorMessage.toLowerCase().includes('malformed') || errorMessage.toLowerCase().includes('unauthorized') || errorMessage.toLowerCase().includes('not authorized')) {
          // Clear invalid token
          localStorage.removeItem("token");
          setToken("");
          setUserData(false);
          // Don't show error toast for JWT errors - they're handled silently
          return Promise.reject(error);
        }
        return Promise.reject(error);
      }
    );
  }, []);
  const value = {
    doctors,
    getDoctorsData,
    currencySymbol,
    token,
    setToken,
    backendUrl,
    userData,
    setUserData,
    loadUserProfileData,
    isLoading,
    setIsLoading,
  };
  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};

export default AppContextProvider;
