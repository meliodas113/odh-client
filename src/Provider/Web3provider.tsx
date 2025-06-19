"use client";
import { createConfig, WagmiProvider } from "wagmi";
import { etherlink, moonbeam } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  rabbyWallet,
  metaMaskWallet,
  coinbaseWallet,
  walletConnectWallet,
} from '@rainbow-me/rainbowkit/wallets';
import { connectorsForWallets } from "@rainbow-me/rainbowkit";
import '@rainbow-me/rainbowkit/styles.css';
import {
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import { http } from "wagmi";
import { ReactNode } from "react";
import { darkTheme } from "@rainbow-me/rainbowkit";
import { useWalletStore } from "@/store/WalletStore";
import { useShallow } from "zustand/react/shallow";



const connectors= connectorsForWallets(
  [
    {
      groupName: 'Recommended',
      wallets: [metaMaskWallet, rabbyWallet],
    },
    {
      groupName: 'Others',
      wallets: [coinbaseWallet, walletConnectWallet],
    },
  ],
  { appName: 'OddsHub', projectId: '4f47bd4a835b9acb58623c50fc5cb8fe' },
);

export const config = createConfig({
   chains: [etherlink, moonbeam],
   connectors,
   transports:{
    [etherlink.id]:http(),
    [moonbeam.id]:http()
   }
});

const queryClient = new QueryClient();

export const Web3Provider = ({ children }: { children: ReactNode }) => {
  const {
    selectedChain
  }=useWalletStore(useShallow((state)=>({
    selectedChain:state.selectedChain
  })))
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          modalSize="compact"
          theme={darkTheme({
            accentColor: '#7b3fe4',
            accentColorForeground: 'white',
            borderRadius: 'small',
            fontStack: 'system',
            overlayBlur: 'small',
          })}
          initialChain={selectedChain===etherlink.id ? etherlink : moonbeam}
        >
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};
