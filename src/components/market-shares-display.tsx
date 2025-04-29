/* eslint-disable react-hooks/exhaustive-deps */
import { Badge } from "./ui/badge";
import { useEffect, useState } from "react";
import { toFixed } from "@/lib/utils";
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

    // Only update if values actually changed
    if (newWinnings.A !== winnings.A || newWinnings.B !== winnings.B) {
      setWinnings(newWinnings);
    }
  }, [sharesBalance, market.totalOptionAShares, market.totalOptionBShares]);

  const displayWinningsA = toFixed(Number(winnings.A)/1e18, 2);
  const displayWinningsB = toFixed(Number(winnings.B)/1e18, 2);
  console.log("the shares are",Number(sharesBalance?.optionBShares)/1e18)
  return (
    <div className="flex flex-col gap-2">
      <div className="w-full text-sm text-muted-foreground text-palette-text">
        Your shares: {market.optionA} -{" "}
        {Number(sharesBalance?.optionAShares)/1e18},{" "}
        {market.optionB} -{" "}
        {Number(sharesBalance?.optionBShares)/1e18}
      </div>
      {(winnings.A > 0 || winnings.B > 0) && (
        <div className="flex flex-col gap-1">
          <div className="text-xs text-muted-foreground">Winnings:</div>
          <div className="flex gap-2">
            <Badge variant="secondary">
              {market.optionA}: {displayWinningsA} shares
            </Badge>
            <Badge variant="secondary">
              {market.optionB}: {displayWinningsB} shares
            </Badge>
          </div>
        </div>
      )}
    </div>
  );
}
