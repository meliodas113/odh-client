import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { useAccount, useReadContract } from "wagmi";
import { MarketProgress } from "./MarketProgress/market-progress";
import { MarketTime } from "./MarketTime/market-time";
import { MarketCardSkeleton } from "./market-card-skeleton";
import { MarketResolved } from "./market-resolved";
import { MarketPending } from "./market-pending";
import { MarketBuyInterface } from "./MarketBuy/market-buy-interface";
import { MarketSharesDisplay } from "./market-shares-display";
import Image from "next/image";
import { abi } from "./ABI/abi";
import { useWalletStore } from "@/store/WalletStore";
import { useShallow } from "zustand/react/shallow";

export interface MarketCardProps {
  index: number;
  filter: "active" | "pending" | "resolved";
  category: string;
}

// Interface for the market data
export interface Market {
  question: string;
  imageURI: string;
  optionA: string;
  optionB: string;
  endTime: bigint;
  outcome: number;
  totalOptionAShares: bigint;
  totalOptionBShares: bigint;
  resolved: boolean;
  category: string;
}

// Interface for the shares balance
export interface SharesBalance {
  optionAShares: bigint;
  optionBShares: bigint;
}

export function MarketCard({ index, filter, category }: MarketCardProps) {
  const account = useAccount();
  const {
    chainId,
    contractAddress
  }=useWalletStore(useShallow((state)=>({
    chainId:state.selectedChain,
    contractAddress:state.contractAddress
  })))
  const { data: marketData, isLoading: isLoadingMarketData } = useReadContract({
    abi,
    address: contractAddress as `0x${string}`,
    functionName: "getMarketInfo",
    args: [BigInt(index)],
  });
  const finalData: [
    string,
    string,
    string,
    string,
    string,
    bigint,
    number,
    bigint,
    bigint,
    boolean
  ] = marketData as [
    string,
    string,
    string,
    string,
    string,
    bigint,
    number,
    bigint,
    bigint,
    boolean
  ];

  const market: Market | undefined = marketData
    ? {
        question: finalData[0],
        imageURI: finalData[1],
        category: finalData[2],
        optionA: finalData[3],
        optionB: finalData[4],
        endTime: finalData[5],
        outcome: finalData[6],
        totalOptionAShares: finalData[7],
        totalOptionBShares: finalData[8],
        resolved: finalData[9],
      }
    : undefined;

  console.log("The market id is",market?.question,index)

  const { data: sharesBalanceData } = useReadContract({
    abi,
    address: contractAddress as `0x${string}`,
    functionName: "getSharesBalance",
    args: [BigInt(index), account?.address as string],
    chainId:chainId
  });

  if (market?.question.toLowerCase() === "none") {
    return null;
  }
  const sharesData: [bigint, bigint] = sharesBalanceData as [bigint, bigint];
  const sharesBalance: SharesBalance | undefined = sharesBalanceData
    ? {
        optionAShares: sharesData[0],
        optionBShares: sharesData[1],
      }
    : undefined;
  const isExpired = new Date(Number(market?.endTime) * 1000) < new Date();
  const isResolved = market?.resolved;
  const shouldShow = () => {
    if (!market) return false;

    switch (filter) {
      case "active":
        return !isExpired;
      case "pending":
        return isExpired && !isResolved;
      case "resolved":
        return isExpired && isResolved;
      default:
        return true;
    }
  };

  // If the market should not be shown, return null
  if (
    !shouldShow() ||
    (category.toLowerCase() !== market?.category.toLowerCase() &&
      !category.toLowerCase().includes("trending"))
  ) {
    return null;
  }

  return (
    <Card
      key={index}
      className="flex flex-col bg-card-bg border-card-border rounded-lg"
    >
      {isLoadingMarketData ? (
        <MarketCardSkeleton />
      ) : (
        <>
          <CardHeader>
            {market && <MarketTime endTime={market.endTime} />}
            <div className="flex items-center gap-2">
              <Image
                src={market?.imageURI || ""}
                alt="Market Icon"
                className="w-7 h-7 text-card-title rounded-full flex justify-center align-center"
                height={32}
                width={33}
              />
              <CardTitle className="text-title-light text-[15px]">
                {market?.question}
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            {market && (
              <MarketProgress
                optionA={market.optionA}
                optionB={market.optionB}
                totalOptionAShares={market.totalOptionAShares}
                totalOptionBShares={market.totalOptionBShares}
              />
            )}
            {new Date(Number(market?.endTime) * 1000) < new Date() ? (
              market?.resolved ? (
                <MarketResolved
                  marketId={index}
                  outcome={market.outcome}
                  optionA={market.optionA}
                  optionB={market.optionB}
                />
              ) : (
                <MarketPending />
              )
            ) : (
              <MarketBuyInterface
                question={market?.question as string}
                marketId={index}
                market={market!}
              />
            )}
          </CardContent>
          {market && sharesBalance && (
              <MarketSharesDisplay
                market={market}
                sharesBalance={sharesBalance}
              />
          )}
        </>
      )}
    </Card>
  );
}
