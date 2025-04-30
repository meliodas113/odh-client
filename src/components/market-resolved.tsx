/* eslint-disable @typescript-eslint/no-unused-vars */

import { Button } from "./ui/button";
import { useAccount, useSendTransaction } from "wagmi";
import { useState } from "react";
import { useWriteContract } from "wagmi";
import { abi } from "./ABI/abi";
import { CONTRACT_ADDRESS } from "@/constants/contract";
interface MarketResolvedProps {
  marketId: number;
  outcome: number;
  optionA: string;
  optionB: string;
}

export function MarketResolved({
  marketId,
  outcome,
  optionA,
  optionB,
}: MarketResolvedProps) {
  const {address}=useAccount();
  const {
    writeContract,
    data,
    error:contractError
}=useWriteContract();

const [enableQuery, setEnableQuery] = useState(false);
  const handleClaimRewards = async () => {  
    console.log("Actively claiming the rewards",marketId)
    try {
      setEnableQuery(true)
      writeContract({
        abi:abi,
        functionName:"claimWinnings",
        address:CONTRACT_ADDRESS as `0x${string}`,
        args:[
          BigInt(marketId)
        ]
      })
      console.log("the contract error is",contractError)
      console.log(data)
      setEnableQuery(false)
    } catch (error) {
      setEnableQuery(false)
      console.log("the contract error is",contractError)
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="mb-2 bg-green-200 p-2 rounded-md text-center text-xs">
        Winning Outcome : {outcome === 0 ? optionA : optionB}
      </div>
      <Button
        variant="outline"
        className="w-full bg-card-bg border-title-accent text-tab-active-text hover:bg-title-accent hover:text-card-bg transition-colors"
        onClick={handleClaimRewards}
      >
        Claim Rewards
      </Button>
    </div>
  );
}
