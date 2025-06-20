import { useWalletStore } from "@/store/WalletStore";
import { useShallow } from "zustand/react/shallow";
import { USDC_ABI } from "@/components/ABI/usdc_abi";
import { useAccount } from "wagmi";
import { useReadContract } from "wagmi";

export const useFetchBalance=()=>{
  const {
    usdcAddress,
    chainId
  }=useWalletStore(useShallow((state)=>({
    usdcAddress:state.usdcAddress,
    chainId:state.selectedChain
  })))

  const {
    address
  }=useAccount();

  const  { data, isLoading: isLoadingUserBalance } = useReadContract({
    abi:USDC_ABI,
    address: usdcAddress as `0x${string}`,
    functionName: "balanceOf",
    args: [
    address
    ],
    chainId:chainId,
    query:{
        enabled:address!==undefined
    }
  },
);
  const userBalance=Number(data)/10**6;
  return {
    userBalance,
    isLoadingUserBalance
  };
}
