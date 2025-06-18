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
}


export const useWalletStore=create<WalletStore>((set) => ({
    userWalletAddress:undefined,
    setUserWalletAddress:(walletAddress:(string | undefined))=>{
    set(()=>({
        userWalletAddress:walletAddress
    }))
    },
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
}))