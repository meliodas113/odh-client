import { ConnectButton, lightTheme } from "thirdweb/react";
import { client } from "@/app/client";
import { baseSepolia, moonbeam } from "thirdweb/chains";
import { inAppWallet } from "thirdweb/wallets";

export function Navbar() {
  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-bold font-inter">
        <span className="text-title-accent">O</span>
        <span className="text-title-light">ddsHub</span>
      </h1>
      <div className="items-center flex gap-2">
        <ConnectButton
          client={client}
          theme={lightTheme()}
          chain={baseSepolia}
          chains={[moonbeam, baseSepolia]}
          connectButton={{
            style: {
              color: "#A3BFFA",
              background: "#0A1A2F",
              fontSize: "0.75rem !important",
              height: "2.5rem !important",
            },
          }}
          wallets={[inAppWallet()]}
          accountAbstraction={{
            chain: baseSepolia,
            sponsorGas: true,
          }}
        />
      </div>
    </div>
  );
}
