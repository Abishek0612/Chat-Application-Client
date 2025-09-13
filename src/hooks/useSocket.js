import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { socketService } from "../services/socket";

export const useSocket = () => {
  const { token, isAuthenticated } = useSelector((state) => state.auth);
  const socketRef = useRef(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState(null);
  const reconnectTimeoutRef = useRef(null);

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

            if (reason === "io server disconnect") {
              if (reconnectTimeoutRef.current) {
                clearTimeout(reconnectTimeoutRef.current);
              }
              reconnectTimeoutRef.current = setTimeout(() => {
                if (socketRef.current && !socketRef.current.connected) {
                  console.log("Attempting manual reconnection...");
                  socketRef.current.connect();
                }
              }, 2000);
            }
          };

          const handleConnectError = (error) => {
            console.error("Socket connection error:", error);
            setIsConnected(false);
            setError("Failed to connect");
          };

          const handleUserOnline = (data) => {
            console.log("User came online:", data);
          };

          const handleUserOffline = (data) => {
            console.log("User went offline:", data);
          };

          socketRef.current.on("connect", handleConnect);
          socketRef.current.on("disconnect", handleDisconnect);
          socketRef.current.on("connect_error", handleConnectError);
          socketRef.current.on("userOnline", handleUserOnline);
          socketRef.current.on("userOffline", handleUserOffline);

          setIsConnected(socketRef.current.connected);
        }
      } catch (error) {
        console.error("Error creating socket connection:", error);
        setError("Failed to initialize connection");
      }
    } else {
      if (socketRef.current) {
        console.log("Disconnecting socket - not authenticated");
        if (reconnectTimeoutRef.current) {
          clearTimeout(reconnectTimeoutRef.current);
        }
        socketService.disconnect();
        socketRef.current = null;
        setIsConnected(false);
        setError(null);
      }
    }

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (socketRef.current) {
        console.log("Cleaning up socket connection");
        const currentSocket = socketRef.current;
        socketRef.current = null;
        setIsConnected(false);
        setError(null);

        try {
          currentSocket.off("connect");
          currentSocket.off("disconnect");
          currentSocket.off("connect_error");
          currentSocket.off("userOnline");
          currentSocket.off("userOffline");
        } catch (err) {
          console.warn("Error cleaning up socket listeners:", err);
        }

        socketService.disconnect();
      }
    };
  }, [isAuthenticated, token]);

  const safeEmit = (...args) => {
    if (
      socketRef.current &&
      isConnected &&
      typeof socketRef.current.emit === "function"
    ) {
      try {
        return socketRef.current.emit(...args);
      } catch (error) {
        console.warn("Socket emit failed:", error);
        return false;
      }
    } else {
      console.warn("Cannot emit - socket not connected");
      return false;
    }
  };

  const safeOn = (...args) => {
    if (socketRef.current && typeof socketRef.current.on === "function") {
      try {
        return socketRef.current.on(...args);
      } catch (error) {
        console.warn("Socket on failed:", error);
        return false;
      }
    } else {
      console.warn("Cannot set up listener - socket not available");
      return false;
    }
  };

  const safeOff = (...args) => {
    if (socketRef.current && typeof socketRef.current.off === "function") {
      try {
        return socketRef.current.off(...args);
      } catch (error) {
        console.warn("Socket off failed:", error);
        return false;
      }
    } else {
      console.warn("Cannot remove listener - socket not available");
      return false;
    }
  };

  if (!socketRef.current) {
    return {
      isConnected: false,
      error,
      emit: () => console.warn("Socket not available"),
      on: () => console.warn("Socket not available"),
      off: () => console.warn("Socket not available"),
    };
  }

  return {
    ...socketRef.current,
    isConnected,
    error,
    emit: safeEmit,
    on: safeOn,
    off: safeOff,
  };
};
