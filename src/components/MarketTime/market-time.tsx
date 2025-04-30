import { useState, useEffect } from "react";
import { Clock } from "lucide-react";
import clsx from "clsx";
import "./styles.css";

interface MarketTimeProps {
  endTime: bigint;
}

export function MarketTime({ endTime }: MarketTimeProps) {
  const [timeLeft, setTimeLeft] = useState<string>("");
  const [isActive, setIsActive] = useState<boolean>(false);
  const [isUrgent, setIsUrgent] = useState<boolean>(false);

  useEffect(() => {
    // Function to calculate and format time remaining
    const updateTimeLeft = () => {
      const now = new Date();
      const end = new Date(Number(endTime) * 1000);
      const diff = end.getTime() - now.getTime();

      // Check if market is still active
      if (diff <= 0) {
        setIsActive(false);
        setTimeLeft("Market Closed");
        return;
      }

      setIsActive(true);

      // Calculate time units
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      // Format time string based on remaining time
      let timeString = "";

      if (days > 0) {
        timeString = `${days}d ${hours}h remaining`;
      } else if (hours > 0) {
        timeString = `${hours}h ${minutes}m remaining`;
      } else if (minutes > 0) {
        timeString = `${minutes}m ${seconds}s remaining`;
      } else {
        timeString = `${seconds}s remaining`;
      }

      // Set urgent flag for visual styling if less than 1 hour remains
      setIsUrgent(days === 0 && hours < 1);

      setTimeLeft(timeString);
    };

    // Update immediately and then every second
    updateTimeLeft();
    const intervalId = setInterval(updateTimeLeft, 1000);

    return () => clearInterval(intervalId);
  }, [endTime]);

  // Format end date for display
  const formattedEndDate = new Date(Number(endTime) * 1000).toLocaleDateString(
    undefined,
    { month: "short", day: "numeric", year: "numeric" }
  );

  return (
    <div
      className={clsx(
        "relative flex items-center mb-2 px-3 py-1.5 rounded-full transition-all max-w-fit",
        isUrgent
          ? "bg-red-500/20 border border-red-500/30 animate-pulse-border"
          : isActive
          ? "bg-blue-500/20 border border-blue-500/30"
          : "bg-gray-500/20 border border-gray-500/30"
      )}
    >
      <div
        className={clsx(
          "mr-2 flex items-center justify-center",
          isUrgent ? "text-red-500 animate-pulse-opacity" : "text-white/80"
        )}
      >
        <Clock size={16} />
      </div>

      <div className="flex flex-row items-center gap-1.5">
        <span className="font-semibold text-sm text-white leading-[1.2]">
          {timeLeft}
        </span>
        <span className="text-xs text-white/70">Ends: {formattedEndDate}</span>
      </div>

      {isUrgent && isActive && (
        <div className="absolute inset-0 rounded-full pointer-events-none animate-pulse-ring" />
      )}
    </div>
  );
}
