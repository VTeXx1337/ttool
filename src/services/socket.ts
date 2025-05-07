import { io, Socket } from "socket.io-client";

interface ServerToClientEvents {
  // Connection events
  connect: () => void;
  disconnect: () => void;
  error: (error: string) => void;

  // TikTok live data events
  viewerCount: (count: number) => void;
  chatMessage: (message: ChatMessage) => void;
  gift: (gift: GiftData) => void;
  userJoined: (user: UserData) => void;
  userLeft: (user: UserData) => void;
  streamEnded: () => void;
  connectionStatus: (status: ConnectionStatus) => void;
}

interface ClientToServerEvents {
  // Empty for now - client primarily consumes events
}

// Type definitions for data received from socket
export interface ChatMessage {
  id: string;
  userId: string;
  username: string;
  content: string;
  timestamp: number;
  profilePicture?: string;
}

export interface GiftData {
  id: string;
  name: string;
  diamondValue: number;
  userId: string;
  username: string;
  timestamp: number;
}

export interface UserData {
  userId: string;
  username: string;
  profilePicture?: string;
  timestamp: number;
}

export type ConnectionStatus =
  | "connecting"
  | "connected"
  | "disconnected"
  | "error";

// Singleton socket instance
let socket: Socket<ServerToClientEvents, ClientToServerEvents> | null = null;

/**
 * Initialize or get the socket.io connection
 */
export function getSocket(): Socket<
  ServerToClientEvents,
  ClientToServerEvents
> {
  if (!socket) {
    // Connect to the WebSocket path using relative URL
    socket = io("/api/live/socket.io", {
      autoConnect: false,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    // Add some default error handling
    socket.on("error", (error) => {
      console.error("Socket error:", error);
    });
  }

  return socket;
}

/**
 * Disconnect and clean up the socket
 */
export function disconnectSocket(): void {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}
