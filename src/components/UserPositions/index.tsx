/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { Badge } from "@/components/ui/badge";
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
import { useReadContract, useAccount } from "wagmi";
import { abi } from "../ABI/abi";
import { useEffect } from "react";
import { PositionRow } from "./PositionRow";
import { CustomChainDropdown } from "../CustomDropDown";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";

export const UserComponent = () => {
  const mobileDevice = useMediaQuery("(max-width: 600px)");
  const { switchChain } = useSwitchChain();
  const router = useRouter();
  const pathname = usePathname();
  const { selectedChain, contractAddress } = useWalletStore(
    useShallow((state) => ({
      selectedChain: state.selectedChain,
      contractAddress: state.contractAddress,
    }))
  );

  useEffect(() => {
    if (!contractAddress || !selectedChain) return;
  }, [selectedChain, contractAddress]);

  const { data: marketCount, isLoading: isLoadingMarketCount } =
    useReadContract({
      abi,
      address: contractAddress as `0x${string}`,
      functionName: "marketCount",
    });

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

  const gridDisplay = mobileDevice ? "15% 70% 15%" :"10% 40% 20% 15% 15%";
  
  return (
    <div className="min-h-screen bg-slate-900 text-white ">
      {/* Header */}
      <div className="border-b border-slate-700 px-3 md:px-6 py-4">
        <div className="flex items-center justify-between w-full md:px-[30px]">
        
        <>
        <div className="flex items-center space-x-2">
            <div className="rounded-full flex items-center justify-center">
             <Image src={"/assets/logos/oddshub.svg"} height={80} width={60} alt=""/>
            </div>
            {!mobileDevice &&  <span className="text-lg font-semibold">OddsHub</span>}
          </div>
        
          {!mobileDevice && <div className="flex flex-row gap-[10px] md:gap-[40px]">
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
        </>
          <div className="flex items-center space-x-4  w-full md:w-[40%] justify-end">
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
                  smallScreen:"address",
                  largeScreen: "full",
                }}
              />
            </div>
          </div>
        </div>
      </div>
     { mobileDevice && <div className="flex flex-row justify-center gap-[50px] w-full p-5">
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
      <div className="flex flex-row w-full justify-center">
        <div className="mt-6 space-y-6 display-flex w-[100%] flex-col px-5 md:w-[90%] lg:w-[80%] xxl:w-[60%]">
          {/* Open Positions */}
          <div className="flex items-center justify-between">
            <h2 className="text-[#e6e6e6] text-[32px] font-alata leading-[100%]">Open Positions</h2>
          </div>
          <div className="p-5 rounded-xl bg-[#071321]">
            <div
              className="grid grid-cols-5 mb-4 text-center"
              style={{ gridTemplateColumns: gridDisplay }}
            >
              <span className="text-[15px] md:text-[14px] leading-[100%] tracking-[0] font-normal font-alata text-[#818181]">Status</span>
              <span className="text-[15px] md:text-[14px] leading-[100%] tracking-[0] font-normal font-alata text-[#818181]">Event</span>
              {!mobileDevice ?<>
                <span className="text-[14px] leading-[100%] tracking-[0] font-normal font-alata text-[#818181]">
                End Time
              </span>
              <span className="text-[14px] leading-[100%] tracking-[0] font-normal font-alata text-[#818181]">Amount</span>
              <span className="text-[14px] leading-[100%] tracking-[0] font-normal font-alata text-[#818181]">
                Prediction
              </span>
              </> 
              : <span className="text-[15px] leading-[100%] tracking-[0] font-normal font-alata text-[#818181]">
                Details
              </span>
              }
            </div>

            {!isLoadingMarketCount &&
              Array.from({ length: Number(marketCount) }, (_, index) => (
                <PositionRow
                  key={index}
                  index={index}
                  gridDisplay={gridDisplay}
                  open={true}
                />
              ))}
          </div>

          <div className="flex items-center justify-between">
            <h2 className="text-[#e6e6e6] text-[32px] font-alata leading-[100%]">Close Positions</h2>
          </div>
          <div className="p-5 rounded-xl bg-[#071321]">
            <div
              className="grid grid-cols-5 mb-4 text-center"
              style={{ gridTemplateColumns: gridDisplay }}
            >
              <span className="text-[14px] leading-[100%] tracking-[0] font-normal font-alata text-[#818181]">Status</span>
              <span className="text-[14px] leading-[100%] tracking-[0] font-normal font-alata text-[#818181]">Event</span>
              {!mobileDevice ?<>
                <span className="text-[14px] leading-[100%] tracking-[0] font-normal font-alata text-[#818181]">
                End Time
              </span>
              <span className="text-[14px] leading-[100%] tracking-[0] font-normal font-alata text-[#818181]">Amount</span>
              <span className="text-[14px] leading-[100%] tracking-[0] font-normal font-alata text-[#818181]">
                Prediction
              </span>
              </> 
              : null
              }
            </div>

            {!isLoadingMarketCount &&
              Array.from({ length: Number(marketCount) }, (_, index) => (
                <PositionRow
                  key={index}
                  index={index}
                  gridDisplay={gridDisplay}
                  open={false}
                />
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};
