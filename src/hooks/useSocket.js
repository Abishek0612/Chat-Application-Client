import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { socketService } from "../services/socket";

export const useSocket = () => {
  const { token, isAuthenticated } = useSelector((state) => state.auth);
  const socketRef = useRef(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isAuthenticated && token) {
      console.log("Connecting socket with token...");

      try {
        socketRef.current = socketService.connect(token);

        if (socketRef.current) {
          const handleConnect = () => {
            console.log("Socket connected successfully");
            setIsConnected(true);
            setError(null);
          };

          const handleDisconnect = (reason) => {
            console.log("Socket disconnected:", reason);
            setIsConnected(false);
          };

          const handleConnectError = (error) => {
            console.error("Socket connection error:", error);
            setIsConnected(false);
            setError("Failed to connect");
          };

          socketRef.current.on("connect", handleConnect);
          socketRef.current.on("disconnect", handleDisconnect);
          socketRef.current.on("connect_error", handleConnectError);

          setIsConnected(socketRef.current.connected);
        }
      } catch (error) {
        console.error("Error creating socket connection:", error);
        setError("Failed to initialize connection");
      }
    } else {
      if (socketRef.current) {
        console.log("Disconnecting socket - not authenticated");
        socketService.disconnect();
        socketRef.current = null;
        setIsConnected(false);
        setError(null);
      }
    }

    return () => {
      if (socketRef.current) {
        console.log("Cleaning up socket connection");
        socketService.disconnect();
        socketRef.current = null;
        setIsConnected(false);
        setError(null);
      }
    };
  }, [isAuthenticated, token]);

  if (!socketRef.current) {
    return null;
  }

  return {
    ...socketRef.current,
    isConnected,
    error,
    emit: (...args) => {
      if (
        socketRef.current &&
        isConnected &&
        typeof socketRef.current.emit === "function"
      ) {
        return socketRef.current.emit(...args);
      } else {
        console.warn("Cannot emit - socket not connected");
        return false;
      }
    },
    on: (...args) => {
      if (socketRef.current && typeof socketRef.current.on === "function") {
        return socketRef.current.on(...args);
      } else {
        console.warn("Cannot set up listener - socket not available");
        return false;
      }
    },
    off: (...args) => {
      if (socketRef.current && typeof socketRef.current.off === "function") {
        return socketRef.current.off(...args);
      } else {
        console.warn("Cannot remove listener - socket not available");
        return false;
      }
    },
  };
};
