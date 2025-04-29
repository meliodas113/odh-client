import { ConnectKitButton } from "connectkit";
import { moonbeam } from "viem/chains";
import { useSwitchChain } from 'wagmi';

export function Navbar() {
  const {switchChain}=useSwitchChain();
  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-bold font-inter">
        <span className="text-title-accent">O</span>
        <span className="text-title-light">ddsHub</span>
      </h1>
      <div className="items-center flex gap-2">
      <ConnectKitButton.Custom>
      {({ isConnected, isConnecting, show, hide, address, ensName, chain }) => {
        return (
          <button onClick={()=>{
            if(show) show();
            if(chain && chain.id! == moonbeam.id){
              switchChain({
                chainId : moonbeam.id
              })
            }
          }}
          className={`px-4 py-2 rounded-xl font-medium transition-all duration-200
            ${isConnected ? "bg-green-600 text-white hover:bg-green-700" : "bg-blue-600 text-white hover:bg-blue-700"}
            active:scale-95 shadow-md`}
          >
            {isConnected ? address : "Connect Wallet"}
          </button>
        );
      }}
    </ConnectKitButton.Custom>
      </div>
    </div>
  );
}
