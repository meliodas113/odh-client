/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { useEffect, useState } from "react";
import { useReadContract } from "wagmi";
import { abi } from "../ABI/abi";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MarketCard } from "../marketCard";
import { Navbar } from "../Navbar/navbar";
import { MarketCardSkeleton } from "../market-card-skeleton";
import OddsHubCentral from "../CentralComponent";
import { Footer } from "../footer";
import { categoryTabs } from "@/lib/config";
import { useWalletStore } from "@/store/WalletStore";
import { useShallow } from "zustand/react/shallow";
import { useRouter, usePathname } from "next/navigation";
import { useMediaQuery } from "@mui/material";
export function EnhancedPredictionMarketDashboard() {
  const mobileDevice = useMediaQuery("(max-width: 600px)");
  const [selectedCategory, setSelectedCategory] = useState("trending");
  const {
    selectedChain,
    contractAddress
  }=useWalletStore(useShallow((state)=>({
    selectedChain:state.selectedChain,
    contractAddress:state.contractAddress
  })))
  const router = useRouter();
  const pathname = usePathname();

  useEffect(()=>{
    if(!contractAddress || !selectedChain) return

  },[selectedChain, contractAddress])

  const { data: marketCount, isLoading: isLoadingMarketCount } =
    useReadContract({
      abi,
      address: contractAddress as `0x${string}`,
      functionName: "marketCount",
    });
  const skeletonCards = Array.from({ length: 6 }, (_, i) => (
    <MarketCardSkeleton key={`skeleton-${i}`} />
  ));

  return (
    <div className="min-h-screen min-w-screen flex flex-col">
      <div className="flex-grow container mx-auto p-4">
        <Navbar />
        <div>
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
          <OddsHubCentral />
        </div>
        <div className="flex flex-row justify-start px-[18px] py-[12px] rounded-[12px] gap-2 mb-4 flex-wrap">
          {categoryTabs.map((tab) => (
            <div
              key={tab.value}
              onClick={() => setSelectedCategory(tab.value)}
              className={`tab-trigger px-4 py-2 rounded-md cursor-pointer font-inter text-sm ${
                selectedCategory === tab.value
                  ? "bg-tab-active-bg text-tab-active-text font-semibold"
                  : "bg-tab-inactive-bg text-tab-inactive-text hover:bg-tab-active-bg/20 hover:text-tab-active-text"
              }`}
            >
              {tab.label}
            </div>
          ))}
        </div>
        <Tabs defaultValue="active" className="w-full mb-[20px]">
          <TabsList className="grid w-full grid-cols-3 bg-tab-inactive-bg rounded-lg p-1">
            <TabsTrigger
              value="active"
              className="font-inter text-sm py-2 px-4 rounded-md data-[state=active]:bg-tab-active-bg data-[state=active]:text-tab-active-text data-[state=inactive]:bg-tab-inactive-bg data-[state=inactive]:text-tab-inactive-text data-[state=inactive]:hover:bg-tab-active-bg/20 data-[state=inactive]:hover:text-tab-active-text"
            >
              Active
            </TabsTrigger>
            <TabsTrigger
              value="pending"
              className="font-inter text-sm py-2 px-4 rounded-md data-[state=active]:bg-tab-active-bg data-[state=active]:text-tab-active-text data-[state=inactive]:bg-tab-inactive-bg data-[state=inactive]:text-tab-inactive-text data-[state=inactive]:hover:bg-tab-active-bg/20 data-[state=inactive]:hover:text-tab-active-text"
            >
              Pending
            </TabsTrigger>
            <TabsTrigger
              value="resolved"
              className="font-inter text-sm py-2 px-4 rounded-md data-[state=active]:bg-tab-active-bg data-[state=active]:text-tab-active-text data-[state=inactive]:bg-tab-inactive-bg data-[state=inactive]:text-tab-inactive-text data-[state=inactive]:hover:bg-tab-active-bg/20 data-[state=inactive]:hover:text-tab-active-text"
            >
              Resolved
            </TabsTrigger>
          </TabsList>

          {isLoadingMarketCount ? (
            <TabsContent value="active" className="mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {skeletonCards}
              </div>
            </TabsContent>
          ) : (
            <>
              <TabsContent value="active">
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {Array.from({ length: Number(marketCount) }, (_, index) => (
                    <MarketCard
                      key={index}
                      index={index}
                      filter="active"
                      category={selectedCategory}
                    />
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="pending">
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {Array.from({ length: Number(marketCount) }, (_, index) => (
                    <MarketCard
                      key={index}
                      index={index}
                      filter="pending"
                      category={selectedCategory}
                    />
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="resolved">
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {Array.from({ length: Number(marketCount) }, (_, index) => (
                    <MarketCard
                      key={index}
                      index={index}
                      filter="resolved"
                      category={selectedCategory}
                    />
                  ))}
                </div>
              </TabsContent>
            </>
          )}
        </Tabs>
      </div>
      <Footer />
    </div>
  );
}
