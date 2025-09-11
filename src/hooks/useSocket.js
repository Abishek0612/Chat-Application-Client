import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { socketService } from "../services/socket";

export const useSocket = () => {
  const { token, isAuthenticated } = useSelector((state) => state.auth);
  const socketRef = useRef(null);

  useEffect(() => {
    if (isAuthenticated && token) {
      socketRef.current = socketService.connect(token);
    } else {
      socketService.disconnect();
      socketRef.current = null;
    }

    return () => {
      if (socketRef.current) {
        socketService.disconnect();
      }
    };
  }, [isAuthenticated, token]);

  return socketRef.current;
};
