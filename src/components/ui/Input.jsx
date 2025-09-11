import React, { forwardRef } from "react";
import { motion } from "framer-motion";
import { clsx } from "clsx";

const variants = {
  default: "border-gray-300 focus:border-primary-500 focus:ring-primary-500",
  error: "border-red-300 focus:border-red-500 focus:ring-red-500",
  success: "border-green-300 focus:border-green-500 focus:ring-green-500",
};

const sizes = {
  sm: "px-3 py-2 text-sm",
  md: "px-4 py-2 text-sm",
  lg: "px-4 py-3 text-base",
};

export const Input = forwardRef(
  (
    {
      type = "text",
      variant = "default",
      size = "md",
      error = false,
      success = false,
      disabled = false,
      placeholder = "",
      className = "",
      leftIcon,
      rightIcon,
      ...props
    },
    ref
  ) => {
    const currentVariant = error ? "error" : success ? "success" : variant;

    return (
      <div className="relative">
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <div className="h-5 w-5 text-gray-400">{leftIcon}</div>
          </div>
        )}

        <motion.input
          ref={ref}
          type={type}
          disabled={disabled}
          placeholder={placeholder}
          whileFocus={{ scale: 1.01 }}
          className={clsx(
            "block w-full rounded-lg border shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-0 disabled:opacity-50 disabled:cursor-not-allowed",
            variants[currentVariant],
            sizes[size],
            leftIcon && "pl-10",
            rightIcon && "pr-10",
            className
          )}
          {...props}
        />

        {rightIcon && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <div className="h-5 w-5 text-gray-400">{rightIcon}</div>
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
