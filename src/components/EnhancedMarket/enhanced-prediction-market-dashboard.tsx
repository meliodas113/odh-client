"use client";
import { useReadContract } from "wagmi";
import { abi } from "../ABI/abi";
import { CONTRACT_ADDRESS } from "@/constants/contract";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MarketCard } from "../marketCard";
import { Navbar } from "../Navbar/navbar";
import { MarketCardSkeleton } from "../market-card-skeleton";
import "./styles.css";
import { useState } from "react";
import OddsHubCentral from "../CentralComponent";

export function EnhancedPredictionMarketDashboard() {
  const [selectedCategory, setSelectedCategory] = useState("trending");
  const { data: marketCount, isLoading: isLoadingMarketCount } =
    useReadContract({
      abi,
      address: CONTRACT_ADDRESS,
      functionName: "marketCount",
    });
  console.log("The market count is", marketCount);

  const skeletonCards = Array.from({ length: 6 }, (_, i) => (
    <MarketCardSkeleton key={`skeleton-${i}`} />
  ));

  const categoryTabs = [
    { label: "🔥 Trending Markets", value: "trending" },
    { label: "🏀 Sports", value: "sports" },
    { label: "🪙 Crypto", value: "crypto" },
    { label: "🗳️ Politics", value: "politics" },
    { label: "🎬 Pop Culture", value: "pop" },
  ];
  return (
    <div className="min-h-screen min-w-screen flex flex-col">
      <div className="flex-grow container mx-auto p-4">
        <Navbar />
        <div>
          <OddsHubCentral/>
        </div>
        <div className="CategoryTabs flex gap-2 mb-4 flex-wrap">
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
    </div>
  );
}
