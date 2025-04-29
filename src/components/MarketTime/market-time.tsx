import { useState, useEffect } from "react";
import { Clock } from "lucide-react";
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
      className={`market-time ${
        isActive ? "market-time--active" : "market-time--closed"
      } ${isUrgent ? "market-time--urgent" : ""}`}
    >
      <div className="market-time__icon">
        <Clock size={16} />
      </div>

      <div className="market-time__content">
        <span className="market-time__countdown">{timeLeft}</span>
        <span className="market-time__date">Ends: {formattedEndDate}</span>
      </div>

      {isUrgent && isActive && <div className="market-time__pulse-ring"></div>}
    </div>
  );
}
