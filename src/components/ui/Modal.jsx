import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "./Button";

export const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  size = "md",
  showCloseButton = true,
}) => {
  const sizes = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-2xl",
    full: "max-w-7xl",
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={onClose}
          />

          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className={clsx(
                  "relative bg-white rounded-lg shadow-xl w-full",
                  sizes[size]
                )}
                onClick={(e) => e.stopPropagation()}
              >
                {title && (
                  <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {title}
                    </h3>
                    {showCloseButton && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={onClose}
                        className="rounded-full p-2"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                )}

                <div className="p-6">{children}</div>
              </motion.div>
            </div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};
