import { abi } from "@/components/ABI/abi";
import {useWriteContract } from "wagmi";
import { CONTRACT_ADDRESS } from "@/constants/contract";
import { useState } from "react";

interface props{
    marketId:number;
    winning_outcome:number;
}

function useSettleMarket() {
  const [enableQuery, setEnableQuery] = useState(false); 
  const {
    writeContract,
    data,
    error:contractError
  }=useWriteContract();

console.log(contractError,enableQuery)

  const settleMarket = async ({marketId, winning_outcome}:props) => {
    try{
      setEnableQuery(true)
      writeContract({
        abi:abi,
        address:CONTRACT_ADDRESS,
        functionName:"resolveMarket",
        args:[
          BigInt(marketId),
          BigInt(winning_outcome)
        ]
      })
      
      return data;
    }catch(err){
      setEnableQuery(false)
      console.log(err)
    }
   
  };

  return { settleMarket };
}

export default useSettleMarket;
