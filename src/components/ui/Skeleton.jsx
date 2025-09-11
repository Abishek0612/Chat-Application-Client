import React from "react";
import { clsx } from "clsx";

export const Skeleton = ({ className = "", ...props }) => {
  return (
    <div
      className={clsx("animate-pulse bg-gray-200 rounded", className)}
      {...props}
    />
  );
};

export const MessageSkeleton = () => (
  <div className="space-y-4 p-4">
    {[...Array(5)].map((_, i) => (
      <div
        key={i}
        className={clsx("flex", i % 2 === 0 ? "justify-start" : "justify-end")}
      >
        <div
          className={clsx(
            "flex space-x-2",
            i % 2 === 1 && "flex-row-reverse space-x-reverse"
          )}
        >
          <Skeleton className="h-8 w-8 rounded-full" />
          <div className="space-y-1">
            <Skeleton
              className={clsx(
                "h-4",
                i % 3 === 0 ? "w-32" : i % 3 === 1 ? "w-48" : "w-24"
              )}
            />
            <Skeleton className="h-3 w-16" />
          </div>
        </div>
      </div>
    ))}
  </div>
);

export const ChatListSkeleton = () => (
  <div className="space-y-1">
    {[...Array(8)].map((_, i) => (
      <div key={i} className="flex items-center space-x-3 p-3">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="flex-1 space-y-1">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
        </div>
        <Skeleton className="h-3 w-8" />
      </div>
    ))}
  </div>
);
