/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Chain, etherlink } from "viem/chains";
import { useSwitchChain } from "wagmi";

export function Navbar() {
  const { switchChain } = useSwitchChain();

  const handleSwitchNetwork = (
    chain: Chain | any
  ) => {
    if (chain && chain.id !== etherlink.id) {
      switchChain({ chainId: etherlink.id });
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
          <ConnectButton label='Connect Wallet'>

          </ConnectButton>
        </div>
      </div>
    </nav>
  );
}
