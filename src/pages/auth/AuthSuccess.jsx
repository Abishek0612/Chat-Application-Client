import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";
import { LoadingSpinner } from "../../components/ui/LoadingSpinner";
import { checkAuthStatus } from "../../store/slices/authSlice";
import toast from "react-hot-toast";

const AuthSuccess = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const token = searchParams.get("token");
    const error = searchParams.get("error");

    if (error) {
      toast.error("Authentication failed");
      navigate("/login");
      return;
    }

    if (token) {
      localStorage.setItem("token", token);

      dispatch(checkAuthStatus()).then((result) => {
        if (result.type === "auth/checkStatus/fulfilled") {
          toast.success("Login successful!");
          navigate("/chat");
        } else {
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
        <div className="flex items-center justify-center mb-6">
          <div className="relative">
            <CheckCircle className="h-16 w-16 text-green-500" />
            <div className="absolute inset-0 flex items-center justify-center">
              <LoadingSpinner size="sm" className="text-green-600" />
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Authentication Successful
        </h2>

        <p className="text-gray-600 mb-6">
          Please wait while we complete your sign-in process...
        </p>

        <div className="flex items-center justify-center space-x-2">
          <LoadingSpinner size="sm" />
          <span className="text-sm text-gray-500">Redirecting...</span>
        </div>
      </motion.div>
    </div>
  );
};

export default AuthSuccess;
