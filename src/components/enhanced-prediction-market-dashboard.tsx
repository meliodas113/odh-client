"use client";
import { useReadContract } from "wagmi";
import { abi } from "./ABI/abi";
import { CONTRACT_ADDRESS } from "@/constants/contract";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MarketCard } from "./marketCard";
import { Market } from "./marketCard";
import { Navbar } from "./navbar";
import { MarketCardSkeleton } from "./market-card-skeleton";
import Image from "next/image";

export function EnhancedPredictionMarketDashboard() {
    const {data:marketCount , isLoading:isLoadingMarketCount} = useReadContract({
    abi,
    address: CONTRACT_ADDRESS,
    functionName: 'marketCount',
  });
  const finalData:Market[]=marketCount as Market[];
  console.log("The market count is",marketCount)

  const skeletonCards = Array.from({ length: 6 }, (_, i) => (
    <MarketCardSkeleton key={`skeleton-${i}`} />
  ));

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-grow container mx-auto p-4">
        <Navbar />
        <div className="mb-4 h-[400px]">
          <Image src="https://i.ibb.co/b9kK9yN/oddshubbg.png" alt="Placeholder Banner"  height={30} width={30} className="w-full h-full object-contain rounded-lg"/>
        </div>
        <Tabs defaultValue="active" className="w-full">
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
              Pending Resolution
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
                    <MarketCard key={index} index={index} filter="active" />
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="pending">
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {Array.from({ length: Number(marketCount) }, (_, index) => (
                    <MarketCard key={index} index={index} filter="pending" />
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="resolved">
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {Array.from({ length: Number(marketCount) }, (_, index) => (
                    <MarketCard key={index} index={index} filter="resolved" />
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
