/* eslint-disable @typescript-eslint/no-unused-vars */

import { Button } from "./ui/button";
import { useAccount, useSendTransaction } from "wagmi";
import { useState } from "react";
import { useWriteContract } from "wagmi";
import { abi } from "./ABI/abi";
import { CONTRACT_ADDRESS } from "@/constants/contract";
import { useToast } from "./ui/use-toast";
import { useEffect } from "react";
import { useReadContract } from "wagmi";

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
  const {
  toast  
  }=useToast();
  const {address}=useAccount();
  const {
    writeContract,
    data,
    error:contractError
}=useWriteContract();

const [enableQuery, setEnableQuery] = useState(false);
const { data: claimCheck }=useReadContract({
  abi,
  address: CONTRACT_ADDRESS,
  functionName: "checkHasClaimed",
  args:[
    address,
    BigInt(marketId)
  ]
});
console.log(claimCheck);
const checkClaimRewards:boolean=claimCheck as boolean;


useEffect(()=>{
  console.log("Showing the toast",data)
  if(data){
    const formattedHash = `${data.slice(0, 15)}...${data.slice(-4)}`;
    toast({
      title: "Purchase Successful!",
      description: `You have successfully claimed your Winnings \n
      The hash of the transaction is ${formattedHash}
       `,
      duration: 5000,
      style:{
       backgroundColor:"#1e3a8a",
       color:"#fff",
       fontSize:"12px"
      },
    }
    );
}
},[data]);

useEffect(() => {
  if (contractError) {
    console.error("Write contract error:", contractError);
    toast({
      title: "Error",
      description: "Transaction failed. Please try again.",
      duration: 5000,
      style:{
       backgroundColor:"#1e3a8a",
       color:"#fff",
       fontSize:"12px"
      },
    });
  }
}, [contractError]);

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
        onClick={()=>{
          if(!checkClaimRewards){
            handleClaimRewards()
          } 
        }}
      >
       {checkClaimRewards ? "Claimed" : "Claim Rewards"}
      </Button>
    </div>
  );
}
