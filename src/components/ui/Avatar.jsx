import React from "react";
import { motion } from "framer-motion";
import { clsx } from "clsx";

const sizes = {
  xs: "h-6 w-6 text-xs",
  sm: "h-8 w-8 text-sm",
  md: "h-10 w-10 text-sm",
  lg: "h-12 w-12 text-base",
  xl: "h-16 w-16 text-lg",
  "2xl": "h-20 w-20 text-xl",
};

export const Avatar = ({
  src,
  alt = "",
  size = "md",
  className = "",
  isOnline = false,
  showOnlineStatus = true,
  fallbackText = "",
  onClick,
}) => {
  const initials =
    fallbackText ||
    alt
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase() ||
    "?";

  return (
    <div className="relative inline-block">
      <motion.div
        whileHover={{ scale: onClick ? 1.05 : 1 }}
        whileTap={{ scale: onClick ? 0.95 : 1 }}
        className={clsx(
          "relative rounded-full overflow-hidden bg-gray-300 flex items-center justify-center font-medium text-gray-600",
          sizes[size],
          onClick && "cursor-pointer",
          className
        )}
        onClick={onClick}
      >
        {src ? (
          <img
            src={src}
            alt={alt}
            className="h-full w-full object-cover"
            onError={(e) => {
              e.target.style.display = "none";
            }}
          />
        ) : (
          <span className="select-none">{initials}</span>
        )}
      </motion.div>

      {showOnlineStatus && (
        <div
          className={clsx(
            "absolute bottom-0 right-0 rounded-full border-2 border-white",
            isOnline ? "bg-green-500" : "bg-gray-400",
            size === "xs" ? "h-2 w-2" : "h-3 w-3"
          )}
        />
      )}
    </div>
  );
};
