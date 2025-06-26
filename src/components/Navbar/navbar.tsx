/* eslint-disable @typescript-eslint/no-unused-vars */
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Chain} from "viem/chains";
import { useAccount, useSwitchChain } from "wagmi";
import { useWalletStore } from '@/store/WalletStore';
import { CONTRACT_ADDRESS_ETHERLINK, CONTRACT_ADDRESS_MOONBEAM, USDC_ETHERLINK, USDC_MOONBEAM } from '@/lib/contract';
import { useShallow } from "zustand/react/shallow";
import { CustomChainDropdown } from '../CustomDropDown';
import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useMediaQuery } from '@mui/material';
export function Navbar() {
  const { switchChain } = useSwitchChain();
  const {address, isConnected, chain}=useAccount();
  const {
    selectedChain
  }=useWalletStore(useShallow((state)=>({
    selectedChain:state.selectedChain
  })))
  const router = useRouter();
  const pathname = usePathname();
  const mobileDevice = useMediaQuery("(max-width: 600px)");
  useEffect(()=>{
    if(chain && useWalletStore.getState().selectedChain !== chain?.id){
      handleSwitchNetwork(chain)
    }
  },[isConnected, chain, address])

  const handleSwitchNetwork = (chain: Chain) => {
    if (chain && chain.id !== selectedChain) {
      switchChain({ chainId: chain.id });
      useWalletStore.getState().setSelectedChain(chain.id)
      if(chain.name.toLowerCase().includes("ether")){
        useWalletStore.getState().setUsdcAddress(USDC_ETHERLINK)
        useWalletStore.getState().setContractAddress(CONTRACT_ADDRESS_ETHERLINK)
      }else{
        useWalletStore.getState().setUsdcAddress(USDC_MOONBEAM);
        useWalletStore.getState().setContractAddress(CONTRACT_ADDRESS_MOONBEAM);
      }
    }
  };

  return (
    // <nav className="w-full z-[100] mb-5 border-b border-[#1f2937] bg-[#161b2e] rounded-lg animate-navbarDropDown">
     <div className="mb-5 border-b border-[#1f2937] bg-[#161b2e] rounded-lg animate-navbarDropDown px-3 md:px-6 py-4">
        <div className="flex items-center justify-between w-full md:5px-[30px]">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
              <div className="w-3 h-3 bg-white rounded-full"></div>
            </div>
            <span className="text-lg font-semibold text-white ">OddsHub</span>
          </div>
         { !mobileDevice && <div className="flex flex-row gap-[40px]">
            <span
              className={`text-lg cursor-pointer ${
                !pathname.includes("UserBets") ? "text-white" : "text-slate-400"
              }`}
              onClick={() => router.push("/")}
            >
              Home
            </span>
            <span
              className={`text-lg cursor-pointer ${
                pathname.includes("UserBets") ? "text-white" : "text-slate-400"
              }`}
              onClick={() => router.push("/UserBets")}
            >
              My Bets
            </span>
          </div>}
          <div className="flex items-center space-x-4 w-[40%] justify-end">
            <div className="flex flex-row justify-end items-center gap-4 w-full">
              <CustomChainDropdown
                selectedChain={selectedChain}
                onChange={handleSwitchNetwork}
              />
              <ConnectButton
                label="Connect Wallet"
                showBalance={false}
                chainStatus={"none"}
                accountStatus={{
                  smallScreen: "avatar",
                  largeScreen: "full",
                }}
              />
            </div>
          </div>
        </div>
      </div>
  // </nav>

  );
}
