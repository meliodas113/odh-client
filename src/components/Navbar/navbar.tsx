import { ConnectKitButton } from "connectkit";
import { moonbeam } from "viem/chains";
import { useSwitchChain } from 'wagmi';
import "./styles.css";

export function Navbar() {
  const { switchChain } = useSwitchChain();

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="logo">
          <span className="logo-accent">O</span>
          <span className="logo-main">ddsHub</span>
        </div>
        
        <div className="navbar-actions">
          <ConnectKitButton.Custom>
            {({ isConnected, show, address, chain }) => {
              const displayAddress = address ? 
                `${address.substring(0, 6)}...${address.substring(address.length - 4)}` : 
                "Connect Wallet";
                
              return (
                <button 
                  onClick={() => {
                    if (show) show();
                    if (chain && chain.id !== moonbeam.id) {
                      switchChain({ chainId: moonbeam.id });
                    }
                  }}
                  className={`connect-button ${isConnected ? 'connected' : ''}`}
                >
                  <span className="button-text">{isConnected ? displayAddress : "Connect Wallet"}</span>
                </button>
              );
            }}
          </ConnectKitButton.Custom>
        </div>
      </div>
    </nav>
  );
}