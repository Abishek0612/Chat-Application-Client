import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { motion } from "framer-motion";
import { LoadingSpinner } from "../ui/LoadingSpinner";
import { checkAuthStatus } from "../../store/slices/authSlice";
import toast from "react-hot-toast";

const GoogleAuth = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const token = searchParams.get("token");
    const error = searchParams.get("error");

    console.log("Google Auth - Token:", token);
    console.log("Google Auth - Error:", error);

    if (error) {
      toast.error("Google authentication failed");
      navigate("/login");
      return;
    }

    if (token) {
      localStorage.setItem("token", token);

      dispatch(checkAuthStatus()).then((result) => {
        if (checkAuthStatus.fulfilled.match(result)) {
          toast.success("Welcome! Login successful");
          navigate("/chat");
        } else {
          console.error("Auth check failed:", result);
          toast.error("Authentication failed");
          navigate("/login");
        }
      });
    } else {
      toast.error("No authentication token received");
      navigate("/login");
    }
  }, [searchParams, navigate, dispatch]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md w-full mx-4"
      >
        <LoadingSpinner size="lg" className="mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Completing Google Sign-in
        </h2>
        <p className="text-gray-600">
          Please wait while we authenticate you...
        </p>
      </motion.div>
    </div>
  );
};

export default GoogleAuth;
