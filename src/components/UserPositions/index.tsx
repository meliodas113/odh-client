/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { TableRow, Table } from "@mui/material";
import { TableHead } from "@mui/material";
import { useSwitchChain } from "wagmi";
import { useWalletStore } from "@/store/WalletStore";
import { useMediaQuery } from "@mui/material";
import { useShallow } from "zustand/react/shallow";
import {
  USDC_ETHERLINK,
  USDC_MOONBEAM,
  CONTRACT_ADDRESS_ETHERLINK,
  CONTRACT_ADDRESS_MOONBEAM,
} from "@/lib/contract";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Chain } from "@rainbow-me/rainbowkit";
import Image from "next/image";

export const UserComponent = () => {
  const mobileDevice = useMediaQuery("(max-width: 600px)");
  const { switchChain } = useSwitchChain();
  const { selectedChain } = useWalletStore(
    useShallow((state) => ({
      selectedChain: state.selectedChain,
    }))
  );

  const handleSwitchNetwork = (chain: Chain) => {
    if (chain && chain.id !== selectedChain) {
      switchChain({ chainId: chain.id });
      useWalletStore.getState().setSelectedChain(chain.id);
      if (chain.name.toLowerCase().includes("ether")) {
        useWalletStore.getState().setUsdcAddress(USDC_ETHERLINK);
        useWalletStore
          .getState()
          .setContractAddress(CONTRACT_ADDRESS_ETHERLINK);
      } else {
        useWalletStore.getState().setUsdcAddress(USDC_MOONBEAM);
        useWalletStore.getState().setContractAddress(CONTRACT_ADDRESS_MOONBEAM);
      }
    }
  };

  const gridDisplay='10% 20% 30% 15% 15%';
  return (
    
    <div className="min-h-screen bg-slate-900 text-white ">
      {/* Header */}
      <div className="border-b border-slate-700 px-6 py-4">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
              <div className="w-3 h-3 bg-white rounded-full"></div>
            </div>
            <span className="text-lg font-semibold">OddsHub</span>
          </div>
          <div className="flex items-center space-x-4 w-[50%] justify-end">
            <div className="flex flex-row justify-end items-center gap-4 w-[70%] sm:w-[50%] lg:w-[35%]">
              <ConnectButton
                label="Connect Wallet"
                showBalance={false}
                chainStatus={"none"}
                accountStatus={{
                  smallScreen: "full",
                  largeScreen: "full",
                }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-row w-full justify-center">
        <div className="mt-6 space-y-6 display-flex flex-col px-5 w-[60%]">
          {/* Open Positions */}
          <div className="flex items-center justify-between mb-">
            <h2 className="text-3xl font-semibold">Open Positions</h2>
          </div>
          <div className="bg-slate-800 border border-slate-700 p-5 rounded-xl">
            {/* Header Row */}
            <div className="grid grid-cols-5 gap-4 mb-4 text-center" style={{ gridTemplateColumns: gridDisplay }}>
              <span className="text-slate-400 text-sm font-medium">Status</span>
              <span className="text-slate-400 text-sm font-medium">Event</span>
              <span className="text-slate-400 text-sm font-medium">
                Date Placed
              </span>
              <span className="text-slate-400 text-sm font-medium">
                Staked Amount
              </span>
              <span className="text-slate-400 text-sm font-medium">
                Prediction
              </span>
            </div>

            {/* Data Row */}
            <div className="grid grid-cols-5 gap-4 items-center py-2 border-t border-slate-700 text-center" style={{ gridTemplateColumns: gridDisplay}}>
              <div>
                <Badge className="bg-green-600 text-white">Open</Badge>
              </div>
              <span className="text-white">Trump vs Biden</span>
              <span className="text-slate-400 text-sm">
                5:32 am, 15th June 2026
              </span>
              <div className="text-white flex items-center gap-1 justify-center">
                <Image
                  height={22}
                  width={22}
                  src="/assets/logos/usdc.svg"
                  alt="USDC"
                />
                <span>10</span>
              </div>
              <span className="text-green-400 font-medium">Yes</span>
            </div>
          </div>

          {/* Closed Positions */}
          {/* <div className="bg-slate-800 border-slate-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">Closed Positions</h2>
                </div>
                  <div className="flex flex-row">
                      <TableHead className="text-slate-400">Status</TableHead>
                      <TableHead className="text-slate-400">Event</TableHead>
                      <TableHead className="text-slate-400">Date Placed</TableHead>
                      <TableHead className="text-slate-400">Settled Amount</TableHead>
                      <TableHead className="text-slate-400">Prediction</TableHead>
                  </div>
                  <div>
                    <TableRow className="border-slate-700">
                      <span>
                        <Badge className="bg-blue-600 text-white">Claim</Badge>
                      </span>
                      <span className="text-white">Trump vs Biden</span>
                      <span className="text-slate-400">5:32 am, 15th June 2026</span>
                      <span className="text-white">⚡ 10</span>
                      <span className="text-green-400">Yes</span>
                    </TableRow>
                    <TableRow className="border-slate-700">
                      <span>
                        <Badge variant="secondary" className="bg-orange-600 text-white">
                          Lost
                        </Badge>
                      </span>
                      <span className="text-white">Belgium vs Slovakia</span>
                      <span className="text-slate-400">5:32 am, 15th June 2026</span>
                      <span className="text-white">⚡ 10</span>
                      <span className="text-red-400">No</span>
                    </TableRow>
                  </div>

                <div className="mt-4 text-center">
                  <Badge variant="secondary" className="bg-blue-600 text-white">
                    591 × 206
                  </Badge>
                </div>
              </CardContent>
            </div> */}
        </div>
      </div>

      <div className="fixed bottom-4 right-4 flex space-x-2">
        <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
          <span className="text-white text-sm font-bold">K</span>
        </div>
      </div>
    </div>
  );
};
