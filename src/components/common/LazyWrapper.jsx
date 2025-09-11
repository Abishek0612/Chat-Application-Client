import React, { Suspense } from "react";
import { LoadingSpinner } from "../ui/LoadingSpinner";
import { ErrorBoundary } from "./ErrorBoundary";

export const LazyWrapper = ({
  children,
  fallback,
  className = "min-h-screen flex items-center justify-center",
}) => {
  const defaultFallback = (
    <div className={className}>
      <LoadingSpinner size="lg" />
    </div>
  );

  return (
    <ErrorBoundary>
      <Suspense fallback={fallback || defaultFallback}>{children}</Suspense>
    </ErrorBoundary>
  );
};
