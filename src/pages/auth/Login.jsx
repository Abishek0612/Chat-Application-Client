import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { LoginForm } from "../../components/auth/LoginForm";
import { useAuth } from "../../hooks/useAuth";

const Login = () => {
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
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Chat App</h2>
          <p className="mt-2 text-sm text-gray-600">
            Connect with friends and family instantly
          </p>
        </div>

        <LoginForm />
      </motion.div>
    </div>
  );
};

export default Login;
