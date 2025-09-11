import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Home, ArrowLeft } from "lucide-react";
import { Button } from "../components/ui/Button";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full text-center"
      >
        <motion.div
          initial={{ y: -50 }}
          animate={{ y: 0 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
          className="mb-8"
        >
          <h1 className="text-9xl font-bold text-gray-200 mb-4">404</h1>
          <div className="text-6xl mb-4">😵</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Page Not Found
          </h2>
          <p className="text-gray-600 text-lg">
            Oops! The page you're looking for doesn't exist. It might have been
            moved, deleted, or you entered the wrong URL.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="space-y-4"
        >
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              onClick={() => navigate(-1)}
              variant="secondary"
              className="flex items-center justify-center"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back
            </Button>

            <Button
              onClick={() => navigate("/chat")}
              className="flex items-center justify-center"
            >
              <Home className="h-4 w-4 mr-2" />
              Go Home
            </Button>
          </div>

          <p className="text-sm text-gray-500">
            Or you can{" "}
            <button
              onClick={() => navigate("/chat")}
              className="text-primary-600 hover:text-primary-700 underline"
            >
              return to your chats
            </button>
          </p>
        </motion.div>

        {/* Fun floating elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-primary-200 rounded-full opacity-20"
              animate={{
                y: [0, -100, 0],
                x: [0, Math.random() * 100 - 50, 0],
                rotate: [0, 360],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default NotFound;
