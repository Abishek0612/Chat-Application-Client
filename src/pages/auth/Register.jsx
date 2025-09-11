import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { RegisterForm } from "../../components/auth/RegisterForm";
import { useAuth } from "../../hooks/useAuth";

const Register = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/chat", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-blue-50 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="mx-auto h-16 w-16 bg-primary-600 rounded-full flex items-center justify-center mb-4">
            <svg
              className="h-8 w-8 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
              />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Join Chat App</h2>
          <p className="mt-2 text-sm text-gray-600">
            Create your account and start chatting
          </p>
        </div>

        <RegisterForm />
      </motion.div>
    </div>
  );
};

export default Register;
