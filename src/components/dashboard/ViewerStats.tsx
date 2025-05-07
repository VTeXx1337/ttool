import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ConnectionStatus } from "@/services/socket";
import { Spinner } from "@/components/ui/spinner";

interface ViewerStatsProps {
  viewerCount: number;
  connectionStatus: ConnectionStatus;
  username: string;
}

export function ViewerStats({
  viewerCount,
  connectionStatus,
  username,
}: ViewerStatsProps) {
  // Helper to get status badge color
  const getStatusBadge = () => {
    switch (connectionStatus) {
      case "connected":
        return (
          <Badge variant="default" className="bg-green-500">
            Connected
          </Badge>
        );
      case "connecting":
        return (
          <Badge variant="default" className="bg-yellow-500">
            Connecting
          </Badge>
        );
      case "error":
        return <Badge variant="destructive">Error</Badge>;
      case "disconnected":
      default:
        return <Badge variant="secondary">Disconnected</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-medium">Live Statistics</CardTitle>
          {getStatusBadge()}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Channel:</span>
            <span className="font-medium">
              {username ? `@${username}` : "Not connected"}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Viewers:</span>
            <div className="flex items-center gap-2">
              {connectionStatus === "connecting" ? (
                <Spinner size="sm" />
              ) : (
                <span className="text-xl font-bold">
                  {connectionStatus === "connected"
                    ? viewerCount.toLocaleString()
                    : "0"}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Status:</span>
            <span>
              {connectionStatus === "connecting" ? (
                <div className="flex items-center gap-2">
                  <Spinner size="sm" />
                  <span>Connecting...</span>
                </div>
              ) : (
                connectionStatus
              )}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
