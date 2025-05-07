import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { useState } from "react";

interface ConnectionControlProps {
  username: string;
  setUsername: (username: string) => void;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  isConnected: boolean;
  isConnecting: boolean;
}

export function ConnectionControl({
  username,
  setUsername,
  connect,
  disconnect,
  isConnected,
  isConnecting,
}: ConnectionControlProps) {
  const [isLoading, setIsLoading] = useState(false);

  // Handle connection
  const handleConnect = async () => {
    setIsLoading(true);
    try {
      await connect();
    } finally {
      setIsLoading(false);
    }
  };

  // Handle disconnection
  const handleDisconnect = async () => {
    setIsLoading(true);
    try {
      await disconnect();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>TikTok Live Connection</CardTitle>
        <CardDescription>
          Enter a TikTok username to connect to their live stream
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <Input
                placeholder="TikTok username (without @)"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={isConnected || isConnecting || isLoading}
              />
            </div>
            <div>
              {!isConnected ? (
                <Button
                  onClick={handleConnect}
                  disabled={!username || isConnecting || isLoading}
                  className="w-full"
                >
                  {isConnecting || isLoading ? (
                    <>
                      <Spinner size="sm" />
                      <span>Connecting...</span>
                    </>
                  ) : (
                    "Connect"
                  )}
                </Button>
              ) : (
                <Button
                  onClick={handleDisconnect}
                  variant="destructive"
                  disabled={isLoading}
                  className="w-full"
                >
                  {isLoading ? (
                    <>
                      <Spinner size="sm" />
                      <span>Disconnecting...</span>
                    </>
                  ) : (
                    "Disconnect"
                  )}
                </Button>
              )}
            </div>
          </div>

          <div className="text-xs text-muted-foreground">
            <p>Auto proxy rotation is enabled to avoid rate limits.</p>
            <p>No login or authentication is required.</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
