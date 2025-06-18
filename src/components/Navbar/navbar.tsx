import { useState } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Chain, etherlink, moonbeam } from "viem/chains";
import { useSwitchChain } from "wagmi";
import { useWalletStore } from '@/store/WalletStore';
import { CONTRACT_ADDRESS_ETHERLINK, CONTRACT_ADDRESS_MOONBEAM } from '@/lib/contract';
import { useShallow } from "zustand/react/shallow";
import { CustomChainDropdown } from '../CustomDropDown';

export function Navbar() {
  const { switchChain } = useSwitchChain();
  const {
    selectedChain
  }=useWalletStore(useShallow((state)=>({
    selectedChain:state.selectedChain
  })))

  const handleSwitchNetwork = (chain: Chain) => {
    if (chain && chain.id !== selectedChain) {
      switchChain({ chainId: chain.id });
      useWalletStore.getState().setSelectedChain(chain.id)
      if(chain.name.toLowerCase().includes("ether")){
        useWalletStore.getState().setContractAddress(CONTRACT_ADDRESS_ETHERLINK)
      }else{
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

      <div className="flex items-center gap-4">
        <CustomChainDropdown
          selectedChain={selectedChain}
          onChange={handleSwitchNetwork}
        />
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
