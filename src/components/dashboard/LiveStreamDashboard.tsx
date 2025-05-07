import { useTikTokLive } from "@/hooks/use-tiktok-live";
import { ChatMessages } from "./ChatMessages";
import { ConnectionControl } from "./ConnectionControl";
import { ViewerStats } from "./ViewerStats";
import { useIsMobile } from "@/hooks/use-mobile";

export function LiveStreamDashboard() {
  const {
    username,
    setUsername,
    connect,
    disconnect,
    isConnected,
    viewerCount,
    connectionStatus,
    messages,
  } = useTikTokLive();

  const isMobile = useIsMobile();
  const isConnecting = connectionStatus === "connecting";

  return (
    <div className="container mx-auto py-6 px-4 sm:px-6">
      <h1 className="text-2xl font-bold mb-6">TikTok Live Dashboard</h1>

      <div className="grid grid-cols-1 gap-6">
        {/* Connection controls - always at the top */}
        <div>
          <ConnectionControl
            username={username}
            setUsername={setUsername}
            connect={connect}
            disconnect={disconnect}
            isConnected={isConnected}
            isConnecting={isConnecting}
          />
        </div>

        {/* Stats and chat - responsive layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Stats card - full width on mobile, 1/3 on desktop */}
          <div className={isMobile ? "col-span-1" : "col-span-1"}>
            <ViewerStats
              viewerCount={viewerCount}
              connectionStatus={connectionStatus}
              username={username}
            />
          </div>

          {/* Chat - full width on mobile, 2/3 on desktop */}
          <div className={isMobile ? "col-span-1" : "col-span-2"}>
            <ChatMessages messages={messages} isConnected={isConnected} />
          </div>
        </div>
      </div>
    </div>
  );
}
