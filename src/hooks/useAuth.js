import { useSelector } from "react-redux";

export const useAuth = () => {
  const { user, token, isAuthenticated, isLoading, error } = useSelector(
    (state) => state.auth
  );

  return {
    user,
    token,
    isAuthenticated,
    isLoading,
    error,
    isLoggedIn: isAuthenticated && !!user,
  };
};
