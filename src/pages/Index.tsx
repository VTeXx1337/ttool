import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">
      <div className="text-center space-y-6">
        <h1 className="text-3xl font-bold text-slate-800">
          TikTok Live Dashboard
        </h1>
        <p className="text-slate-600 max-w-md mx-auto">
          Connect to TikTok live streams, view real-time stats, and read chat
          messages without login or authentication.
        </p>
        <Button asChild size="lg">
          <Link to="/dashboard">Launch Dashboard</Link>
        </Button>
      </div>
    </div>
  );
};

export default Index;
