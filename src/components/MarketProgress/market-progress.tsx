import { useState, useEffect } from "react";
import { FetchSharesFunction } from "@/lib/contract";
import Image from "next/image";
interface MarketProgressProps {
  optionA: string;
  optionB: string;
  totalOptionAShares: bigint;
  totalOptionBShares: bigint;
  marketId:number;
}

export function MarketProgress({
  optionA,
  optionB,
  totalOptionAShares,
  totalOptionBShares,
  marketId
}: MarketProgressProps) {
  const [animationComplete, setAnimationComplete] = useState(false);
  const [hoveredOption, setHoveredOption] = useState<null | "A" | "B">(null);
  const totalMarketShares=FetchSharesFunction(marketId)
  const aShares = Number(totalOptionAShares)+ Number(totalMarketShares.optionAShares);
  const bShares = Number(totalOptionBShares)+ Number(totalMarketShares.optionBShares);
  const total = aShares + bShares;

  const percentA = total > 0 ? (aShares / total) * 100 : 50;
  const percentB = total > 0 ? (bShares / total) * 100 : 50;

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimationComplete(true);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="w-full mb-2.5">
      <div className="flex flex-col sm:flex-row sm:justify-between gap-2.5 mb-2.5">
        {[
          { id: "A", name: optionA, percent: percentA },
          { id: "B", name: optionB, percent: percentB },
        ].map((opt) => (
          <div
            key={opt.id}
            onMouseEnter={() => setHoveredOption(opt.id as "A" | "B")}
            onMouseLeave={() => setHoveredOption(null)}
            className={`flex items-center justify-between flex-1 px-3 py-2 rounded-lg cursor-pointer transition-all duration-200 ${
              opt.id === "A"
                ? "border-l-4 border-blue-500"
                : "border-l-4 border-orange-500"
            } ${
              hoveredOption === opt.id
                ? `-translate-y-[3px] shadow-md ${
                    opt.id === "A" ? "bg-blue-500/15" : "bg-orange-500/15"
                  }`
                : "bg-black/20"
            }`}
          >
            <span className="font-semibold text-sm text-white truncate max-w-[70%]">
              {opt.name}
            </span>
            <span className="font-bold text-sm px-2 py-1 rounded-full bg-black/30 text-white">
              {opt.percent.toFixed(1)}%
            </span>
          </div>
        ))}
      </div>

      {/* Progress bar */}
      <div className="relative h-6 w-full bg-black/20 rounded-full overflow-hidden flex mb-4">
        {/* Bar A */}
        <div
          className="h-full bg-gradient-to-r from-blue-600 to-blue-400 rounded-l-full flex items-center justify-center transition-all duration-1000 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] relative overflow-hidden"
          style={{ width: animationComplete ? `${percentA}%` : "0%" }}
        >
          {percentA > 15 && (
            <span className="text-white text-xs font-semibold px-2 truncate z-10">
              {optionA}
            </span>
          )}
          <div className="absolute top-0 bottom-0 left-[-100%] w-1/2 animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        </div>

        {/* Bar B */}
        <div
          className="h-full bg-gradient-to-r from-orange-500 to-orange-400 rounded-r-full flex items-center justify-center transition-all duration-1000 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] relative overflow-hidden"
          style={{ width: animationComplete ? `${percentB}%` : "0%" }}
        >
          {percentB > 15 && (
            <span className="text-white text-xs font-semibold px-2 truncate z-10">
              {optionB}
            </span>
          )}
          <div className="absolute top-0 bottom-0 left-[-100%] w-1/2 animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        </div>
      </div>

      {/* Stats */}
      <div className="flex flex-row justify-between text-sm text-white/70 gap-2">
        <div className="flex items-center">
          <span className="mr-2">{optionA} Shares:</span>
          <span className="font-semibold text-white flex flex-row gap-1">
            {(aShares / 1e6).toLocaleString()}
            <Image src={"/assets/logos/usdc.svg"} height={18} width={18} alt=""/>
          </span>
        </div>
        <div className="flex items-center">
          <span className="mr-2">{optionB} Shares:</span>
          <span className="font-semibold text-white flex flex-row gap-1">
            {(bShares / 1e6).toLocaleString()}
            <Image src={"/assets/logos/usdc.svg"} height={18} width={18} alt=""/>
          </span>
        </div>
      </div>
    </div>
  );
}
