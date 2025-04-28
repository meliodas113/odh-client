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
  const isEnded = new Date(Number(endTime) * 1000) < new Date();
  const formattedDate = formatDate(
    new Date(Number(endTime) * 1000).toISOString()
  );

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
