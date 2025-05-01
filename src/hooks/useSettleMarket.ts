import { abi } from "@/components/ABI/abi";
import {useWriteContract } from "wagmi";
import { CONTRACT_ADDRESS } from "@/constants/contract";
import { useState } from "react";

interface props{
    marketId:number;
    winning_outcome:number;
    categoryId:number;
}

function useSettleMarket() {
  const [enableQuery, setEnableQuery] = useState(false);
  // const handleToast = (
  //   message: string,
  //   subHeading: string,
  //   type: string,
  //   hash?: string
  // ) => {
  //   enqueueSnackbar(message, {
  //     //@ts-ignore
  //     variant: "custom",
  //     subHeading: subHeading,
  //     hash: hash,
  //     type: type,
  //     anchorOrigin: {
  //       vertical: "top",
  //       horizontal: "right",
  //     },
  //   });
  // };
  // const handleToastRef = useRef<
  //     (
  //       heading: string,
  //       subHeading: string,
  //       type: string,
  //       hash?: string | undefined,
  //       chainId?: number | undefined
  //     ) => void
  //   >(handleToast);
  const {
    writeContract,
    data,
    error:contractError
  }=useWriteContract();

console.log(contractError,enableQuery)

  const settleMarket = async ({}:props) => {
    try{
      setEnableQuery(true)
      writeContract({
        abi:abi,
        address:CONTRACT_ADDRESS,
        functionName:"resolveMarket",
        args:[
          1,
          2
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
