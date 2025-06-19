import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Chain} from "viem/chains";
import { useAccount, useSwitchChain } from "wagmi";
import { useWalletStore } from '@/store/WalletStore';
import { CONTRACT_ADDRESS_ETHERLINK, CONTRACT_ADDRESS_MOONBEAM, USDC_ETHERLINK, USDC_MOONBEAM } from '@/lib/contract';
import { useShallow } from "zustand/react/shallow";
import { CustomChainDropdown } from '../CustomDropDown';
import { useEffect } from 'react';

export function Navbar() {
  const { switchChain } = useSwitchChain();
  const {address, isConnected, chain}=useAccount();
  const {
    selectedChain
  }=useWalletStore(useShallow((state)=>({
    selectedChain:state.selectedChain
  })))


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
    <nav className="w-full z-[100] mb-5 border-b border-[#1f2937] bg-[#161b2e] rounded-lg animate-navbarDropDown">
    <div className="max-w-[1480px] mx-auto h-16 px-4 sm:px-6 flex items-center justify-between">
      <div className="text-[1.75rem] font-bold tracking-tight font-inter bg-gradient-to-r from-[#60a5fa] to-[#f9fafb] bg-clip-text text-transparent">
        <span className="text-[#60a5fa] font-extrabold">O</span>
        <span className="text-[#f9fafb]">ddsHub</span>
      </div>

      <div className="flex flex-row justify-end items-center gap-4 w-[30%]">
        {<CustomChainDropdown
          selectedChain={selectedChain}
          onChange={handleSwitchNetwork}
        />}
        <ConnectButton label='Connect Wallet' showBalance={false} chainStatus={"none"} 
          accountStatus={{
            smallScreen: 'full',
            largeScreen: 'full',
          }}
        />
      </div>
    </div>
  </nav>

  );
}
