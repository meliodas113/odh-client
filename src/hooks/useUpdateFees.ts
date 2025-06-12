import { abi } from "@/components/ABI/abi";
import {useWriteContract } from "wagmi";
import { CONTRACT_ADDRESS } from "@/lib/contract";
import { useState } from "react";


function useUpdateFees() {
  const [enableQuery, setEnableQuery] = useState(false);

  const {
    writeContract,
    data,
    error:contractError
  }=useWriteContract();

console.log(contractError,enableQuery)

  const updateFees = async (amount:number) => {
    try{
      setEnableQuery(true)
      writeContract({
        abi:abi,
        address:CONTRACT_ADDRESS,
        functionName:"updateFees",
        args:[
          BigInt(amount)
        ]
      })
      
      return data;
    }catch(err){
      setEnableQuery(false)
      console.log(err)
    }
   
  };

  return { updateFees };
}

export default useUpdateFees;
