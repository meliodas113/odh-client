import {create} from "zustand";
import { etherlink } from "viem/chains";
import { CONTRACT_ADDRESS_ETHERLINK } from "@/lib/contract";
interface WalletStore{
    userWalletAddress:string | undefined;
    setUserWalletAddress:(walletAddress : string | undefined)=>void;
    selectedChain: number;
    setSelectedChain: (chainId : number)=>void;
    contractAddress:string;
    setContractAddress:(contractAddress : string)=>void;
    usdcAddress:string;
    setUsdcAddress:(usdc:string)=>void;
}


export const useWalletStore=create<WalletStore>((set) => ({
    userWalletAddress:undefined,
    setUserWalletAddress:(walletAddress:(string | undefined))=>{
    set(()=>({
        userWalletAddress:walletAddress
    }))
    },
    usdcAddress:"0x796Ea11Fa2dD751eD01b53C372fFDB4AAa8f00F9",
    selectedChain : etherlink.id,
    setSelectedChain:(chainId : number)=>{
    set(()=>({
        selectedChain:chainId
    })) 
    },
    contractAddress:CONTRACT_ADDRESS_ETHERLINK,
    setContractAddress:(contractAddress:string)=>{
        set(()=>({
            contractAddress:contractAddress
        }))
    },
    setUsdcAddress:(usdc:string)=>{
        set(()=>({
            usdcAddress:usdc
        }))
    }
}))