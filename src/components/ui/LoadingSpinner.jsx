import React from "react";
import { motion } from "framer-motion";
import { clsx } from "clsx";

const sizes = {
  sm: "h-4 w-4",
  md: "h-6 w-6",
  lg: "h-8 w-8",
  xl: "h-12 w-12",
};

export const LoadingSpinner = ({ size = "md", className = "" }) => {
  return (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      className={clsx(
        "inline-block border-2 border-current border-r-transparent rounded-full",
        sizes[size],
        className
      )}
    />
  );
};
