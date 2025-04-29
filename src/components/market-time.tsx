import { cn } from "@/lib/utils";

interface MarketTimeProps {
  endTime: bigint;
  className?: string;
}
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export function MarketTime({ endTime, className }: MarketTimeProps) {
  const timeInMs = Number(endTime) * 1000; // Convert seconds to milliseconds
  const isEnded = new Date(timeInMs) < new Date();
  const formattedDate = formatDate(new Date(timeInMs).toISOString());

  console.log("the formatted date is", formattedDate);

  return (
    <div
      className={cn(
        "mb-2 w-fit px-2 py-1 rounded border text-xs font-inter",
        isEnded
          ? "bg-badge-ended-bg border-badge-ended-border text-badge-ended-text"
          : "bg-badge-active-bg border-badge-active-border text-badge-active-text",
        className
      )}
    >
      {isEnded ? "Ended: " : "Ends: "}
      {formattedDate}
    </div>
  );
}

