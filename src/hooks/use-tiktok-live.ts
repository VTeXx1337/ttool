import { useCallback, useEffect, useState } from "react";
import { api } from "@/services/api";
import {
  ChatMessage,
  ConnectionStatus,
  GiftData,
  UserData,
  disconnectSocket,
  getSocket,
} from "@/services/socket";
import { useToast } from "@/hooks/use-toast";

interface TikTokLiveState {
  username: string;
  isConnected: boolean;
  viewerCount: number;
  connectionStatus: ConnectionStatus;
  messages: ChatMessage[];
  sessionId: string | null;
  gifts: GiftData[];
  recentUsers: UserData[];
}

export function useTikTokLive() {
  const { toast } = useToast();
  const [state, setState] = useState<TikTokLiveState>({
    username: "",
    isConnected: false,
    viewerCount: 0,
    connectionStatus: "disconnected",
    messages: [],
    sessionId: null,
    gifts: [],
    recentUsers: [],
  });

  // Handle input change for username
  const setUsername = useCallback((username: string) => {
    setState((prev) => ({ ...prev, username }));
  }, []);

  // Connect to TikTok live stream
  const connect = useCallback(async () => {
    if (!state.username) {
      toast({
        title: "Username required",
        description: "Please enter a TikTok username to connect",
        variant: "destructive",
      });
      return;
    }

    try {
      // Update connection status
      setState((prev) => ({ ...prev, connectionStatus: "connecting" }));

      // First, rotate proxy to avoid rate limits
      await api.rotateProxy();

      // Then start the live stream connection
      const { success, sessionId } = await api.startLiveStream(state.username);

      if (success && sessionId) {
        // Update state with session ID
        setState((prev) => ({
          ...prev,
          sessionId,
          connectionStatus: "connected",
          isConnected: true,
          // Reset data
          messages: [],
          gifts: [],
          recentUsers: [],
          viewerCount: 0,
        }));

        // Initialize socket connection
        const socket = getSocket();

        // Connect if not already connected
        if (!socket.connected) {
          socket.connect();
        }

        toast({
          title: "Connected",
          description: `Connected to ${state.username}'s live stream`,
        });
      } else {
        throw new Error("Failed to connect to live stream");
      }
    } catch (error) {
      let errorMessage = "Failed to connect to live stream";
      if (error instanceof Error) {
        errorMessage = error.message;
      }

      setState((prev) => ({
        ...prev,
        connectionStatus: "error",
        isConnected: false,
      }));

      toast({
        title: "Connection Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  }, [state.username, toast]);

  // Disconnect from TikTok live stream
  const disconnect = useCallback(async () => {
    try {
      if (state.sessionId) {
        await api.stopLiveStream(state.sessionId);
      }

      // Disconnect socket
      disconnectSocket();

      // Reset state
      setState((prev) => ({
        ...prev,
        isConnected: false,
        connectionStatus: "disconnected",
        sessionId: null,
      }));

      toast({
        title: "Disconnected",
        description: `Disconnected from ${state.username}'s live stream`,
      });
    } catch (error) {
      let errorMessage = "Failed to disconnect from live stream";
      if (error instanceof Error) {
        errorMessage = error.message;
      }

      toast({
        title: "Disconnection Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  }, [state.sessionId, state.username, toast]);

  // Set up socket event listeners
  useEffect(() => {
    if (!state.isConnected) return;

    const socket = getSocket();

    // Connection events
    socket.on("connect", () => {
      setState((prev) => ({ ...prev, connectionStatus: "connected" }));
    });

    socket.on("disconnect", () => {
      setState((prev) => ({ ...prev, connectionStatus: "disconnected" }));
    });

    socket.on("error", (error) => {
      toast({
        title: "Socket Error",
        description: error,
        variant: "destructive",
      });
      setState((prev) => ({ ...prev, connectionStatus: "error" }));
    });

    // Data events
    socket.on("viewerCount", (count) => {
      setState((prev) => ({ ...prev, viewerCount: count }));
    });

    socket.on("chatMessage", (message) => {
      setState((prev) => ({
        ...prev,
        messages: [...prev.messages.slice(-99), message],
      }));
    });

    socket.on("gift", (gift) => {
      setState((prev) => ({
        ...prev,
        gifts: [...prev.gifts.slice(-9), gift],
      }));
    });

    socket.on("userJoined", (user) => {
      setState((prev) => ({
        ...prev,
        recentUsers: [...prev.recentUsers.slice(-19), user],
      }));
    });

    socket.on("streamEnded", () => {
      toast({
        title: "Stream Ended",
        description: `${state.username}'s live stream has ended`,
      });
      disconnect();
    });

    socket.on("connectionStatus", (status) => {
      setState((prev) => ({ ...prev, connectionStatus: status }));
    });

    // Cleanup listeners when effect runs again or component unmounts
    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("error");
      socket.off("viewerCount");
      socket.off("chatMessage");
      socket.off("gift");
      socket.off("userJoined");
      socket.off("streamEnded");
      socket.off("connectionStatus");
    };
  }, [state.isConnected, state.username, disconnect, toast]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (state.isConnected) {
        disconnect();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    // State
    username: state.username,
    isConnected: state.isConnected,
    viewerCount: state.viewerCount,
    connectionStatus: state.connectionStatus,
    messages: state.messages,
    gifts: state.gifts,
    recentUsers: state.recentUsers,

    // Actions
    setUsername,
    connect,
    disconnect,
  };
}
