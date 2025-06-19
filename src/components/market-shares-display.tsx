import { Badge } from "./ui/badge";
import { useEffect, useState } from "react";
import { toFixed } from "@/lib/utils";
import Image from "next/image";

interface MarketSharesDisplayProps {
  market: {
    optionA: string;
    optionB: string;
    totalOptionAShares: bigint;
    totalOptionBShares: bigint;
  };
  sharesBalance: {
    optionAShares: bigint;
    optionBShares: bigint;
  };
}

export function MarketSharesDisplay({
  market,
  sharesBalance,
}: MarketSharesDisplayProps) {
  const [winnings, setWinnings] = useState<{ A: bigint; B: bigint }>({
    A: BigInt(0),
    B: BigInt(0),
  });

  const calculateWinnings = (option: "A" | "B") => {
    if (!sharesBalance || !market) return BigInt(0);

    const userShares =
      option === "A"
        ? sharesBalance.optionAShares
        : sharesBalance.optionBShares;
    const totalSharesForOption =
      option === "A" ? market.totalOptionAShares : market.totalOptionBShares;
    const totalLosingShares =
      option === "A" ? market.totalOptionBShares : market.totalOptionAShares;

    if (totalSharesForOption === BigInt(0)) return BigInt(0);

    const userProportion =
      (userShares * BigInt(1000000)) / totalSharesForOption;

    const winningsFromLosingShares =
      (totalLosingShares * userProportion) / BigInt(1000000);
    return userShares + winningsFromLosingShares;
  };

  useEffect(() => {
    if (!sharesBalance || !market) return;

    const newWinnings = {
      A: calculateWinnings("A"),
      B: calculateWinnings("B"),
    };

    if (newWinnings.A !== winnings.A || newWinnings.B !== winnings.B) {
      setWinnings(newWinnings);
    }
  }, [sharesBalance, market.totalOptionAShares, market.totalOptionBShares]);

  const displayWinningsA = toFixed(Number(winnings.A) / 1e6, 3);
  const displayWinningsB = toFixed(Number(winnings.B) / 1e6, 3);

  if (winnings.A === BigInt(0) && winnings.B === BigInt(0)) return null;

  return (
    <div className="flex flex-col gap-2 p-3 sm:p-3 md:p-5 pt-0 sm:pt-0 md:pt-0">
      <div className="flex flex-row gap-5 items-center">
        <div className="text-md text-muted-foreground flex align-center gap-2 flex-row justify-start">
          <Image src={"/assets/logos/usdc.svg"} height={28} width={28} alt="usd"/>
         <span className="mt-[2px]">
         Winnings:
          </span>
          </div>
        <div className="flex gap-2">
          <Badge variant="secondary" className="text-[12px] sm:text-sm md:text-[12px]">
            {market.optionA}: {displayWinningsA}
          </Badge>
          <Badge variant="secondary" className="text-[12px] sm:text-sm md:text-[12px]">
            {market.optionB}: {displayWinningsB}
          </Badge>
        </div>
      </div>
    </div>
  );
}
