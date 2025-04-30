import { ConnectKitButton } from "connectkit";
import { Chain, etherlink } from "viem/chains";
import { useSwitchChain } from "wagmi";

export function Navbar() {
  const { switchChain } = useSwitchChain();

  const handleSwitchNetwork = (
    show: (() => void) | undefined,
    chain: Chain | any
  ) => {
    if (show) show();
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
          <ConnectKitButton.Custom>
            {({ isConnected, show, address, chain }) => {
              const displayAddress = address
                ? `${address.slice(0, 6)}...${address.slice(-4)}`
                : "Connect Wallet";

              return (
                <button
                  onClick={() => handleSwitchNetwork(show, chain)}
                  className={`relative min-w-[10rem] px-5 py-2.5 text-sm font-semibold rounded-xl transition-all duration-200 overflow-hidden shadow-md ${
                    isConnected
                      ? "bg-[#10b981] hover:bg-[#059669]"
                      : "bg-[#3b82f6] hover:bg-[#2563eb]"
                  } text-white hover:-translate-y-[2px] active:scale-95`}
                >
                  <span className="relative z-10">
                    {isConnected ? displayAddress : "Connect Wallet"}
                  </span>
                  <span className="absolute inset-0 -left-full w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-all duration-500 group-hover:left-full" />
                </button>
              );
            }}
          </ConnectKitButton.Custom>
        </div>
      </div>
    </nav>
  );
}
