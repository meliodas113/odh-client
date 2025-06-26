/* eslint-disable @typescript-eslint/no-unused-vars */

import { useAccount, useReadContract } from "wagmi";
import { Market, UserPosition } from "@/types/types";
import { useWalletStore } from "@/store/WalletStore";
import { useShallow } from "zustand/react/shallow";
import { abi } from "../../ABI/abi";
import { SharesBalance } from "@/components/marketCard";
import Image from "next/image";
import { useMediaQuery } from "@mui/material";
import { IoMdArrowDropdown } from "react-icons/io";
import { useState } from "react";
import { useEffect } from "react";

interface Props {
  index: number;
  gridDisplay: string;
  open: boolean;
}

export const PositionRow = ({ index, gridDisplay, open }: Props) => {
  const account = useAccount();
  const [openDropwDown, setOpenDropDown] = useState<boolean>(false);
  const mobileDevice = useMediaQuery("(max-width: 600px)");
  const { chainId, contractAddress } = useWalletStore(
    useShallow((state) => ({
      chainId: state.selectedChain,
      contractAddress: state.contractAddress,
    }))
  );

  useEffect(() => {
    if (!mobileDevice && openDropwDown) {
      setOpenDropDown(false); // Close dropdown if switching to desktop
    }
  }, [mobileDevice]);

  const { data: marketData, isLoading: isLoadingMarketData } = useReadContract({
    abi,
    address: contractAddress as `0x${string}`,
    functionName: "getMarketInfo",
    args: [BigInt(index)],
  });
  const finalData: [
    string,
    string,
    string,
    string,
    string,
    bigint,
    number,
    bigint,
    bigint,
    boolean
  ] = marketData as [
    string,
    string,
    string,
    string,
    string,
    bigint,
    number,
    bigint,
    bigint,
    boolean
  ];

  const market: Market | undefined = marketData
    ? {
        question: finalData[0],
        imageURI: finalData[1],
        category: finalData[2],
        optionA: finalData[3],
        optionB: finalData[4],
        endTime: finalData[5],
        outcome: finalData[6],
        totalOptionAShares: finalData[7],
        totalOptionBShares: finalData[8],
        resolved: finalData[9],
      }
    : undefined;

  const { data: claimCheck } = useReadContract({
    abi,
    address: contractAddress as `0x${string}`,
    functionName: "checkHasClaimed",
    args: [account.address, BigInt(index)],
    chainId: chainId,
  });

  const { data: sharesBalanceData } = useReadContract({
    abi,
    address: contractAddress as `0x${string}`,
    functionName: "getSharesBalance",
    args: [BigInt(index), account?.address as string],
    chainId: chainId,
  });

  const sharesData: [bigint, bigint] = sharesBalanceData as [bigint, bigint];

  const sharesBalance: SharesBalance | undefined = sharesBalanceData
    ? {
        optionAShares: sharesData[0],
        optionBShares: sharesData[1],
      }
    : undefined;

  const affirmativePredictions: UserPosition[] = [];
  const negativePredictions: UserPosition[] = [];

  if (Number(sharesBalance?.optionAShares) > 0) {
    affirmativePredictions.push({
      marketName: market?.question as string,
      outcome: market?.optionA as string,
      endTime: Number(market?.endTime) as number,
      shares: Number(sharesBalance?.optionAShares),
      isOpen: !market?.resolved,
      outcomeIndex: 0,
    });
  }

  if (Number(sharesBalance?.optionBShares) > 0) {
    negativePredictions.push({
      marketName: market?.question as string,
      outcome: market?.optionB as string,
      endTime: Number(market?.endTime) as number,
      shares: Number(sharesBalance?.optionBShares) as number,
      isOpen: !market?.resolved,
      outcomeIndex: 1,
    });
  }

  if (market === undefined || market.question === "none") return null;

  if (market?.question.toLowerCase() === "none") {
    return null;
  }

  const finalPositions = [...affirmativePredictions, ...negativePredictions];

  if (finalPositions.length === 0) return null;

  const renderCloseMarketButton = (userPosition: UserPosition) => {
    if (market.outcome === userPosition.outcomeIndex) {
      if (userPosition.shares > 0 && !claimCheck) {
        return (
          <div>
            <button className="px-4 py-2 rounded-lg bg-[#1c9ee9] text-white text-[15px] font-alata">
              Claim
            </button>
          </div>
        );
      } else {
        return (
          <span className="text-white font-alata text-[15px]">Claimed</span>
        );
      }
    }
    return <span className="text-white font-alata text-[15px]">Lost</span>;
  };

  return (
    <>
      {finalPositions.filter((item) => item.isOpen === open).length > 0 ? (
        finalPositions
          .filter((item) => item.isOpen === open)
          .map((item: UserPosition, index: number) => {
            return (
              <>
                <div
                  className="grid grid-cols-5 items-center py-2 text-center"
                  style={{ gridTemplateColumns: gridDisplay }}
                  key={index}
                >
                  <div className="flex flex-row justify-center">
                    {open ? (
                      <span className="text-white font-alata text-[15px]">
                        Open
                      </span>
                    ) : (
                      renderCloseMarketButton(item)
                    )}
                  </div>
                  <span className="text-[16px] leading-[100%] tracking-[0] font-normal font-alata">
                    {item.marketName.slice(0, 30)}...
                  </span>
                  {!mobileDevice ? (
                    <>
                      <span className="text-[16px] leading-[100%] tracking-[0] font-normal font-alata">
                        {market.endTime &&
                          new Date(Number(market?.endTime) * 1000)
                            .toISOString()
                            .split("T")[0]}
                      </span>
                      <div className="text-white flex items-center gap-1 justify-center">
                        <Image
                          height={16}
                          width={16}
                          src="/assets/logos/usdc.svg"
                          alt="USDC"
                        />
                        <span className="text-[16px] leading-[100%] tracking-[0] font-normal font-alata">
                          {Number(item.shares / 10 ** 6).toFixed(3)}
                        </span>
                      </div>
                      <span
                        className="text-[16px] leading-[100%] tracking-[0] font-normal font-alata"
                        style={{
                          color: item.outcomeIndex ? "#FA7d22" : "#1C9EE9",
                        }}
                      >
                        {item.outcome}
                      </span>
                    </>
                  ) : (
                    <span
                      className="text-[20px] flex flex-row align-center justify-center mt-[8px]"
                      onClick={() => {
                        setOpenDropDown(!openDropwDown);
                      }}
                    >
                      <IoMdArrowDropdown />
                    </span>
                  )}
                </div>
                {mobileDevice && openDropwDown && (
                  <div className="w-full posti">
                    <div
                      className="grid grid-cols-3 items-center py-2 text-center w-full"
                      style={{ gridTemplateColumns: "30% 40% 30%" }}
                    >
                      <span className="text-[14px] leading-[100%] tracking-[0] font-normal font-alata text-[#818181]">
                       End Time
                      </span>
                      <span className="text-[14px] leading-[100%] tracking-[0] font-normal font-alata text-[#818181]">
                        Amount
                      </span>
                      <span className="text-[14px] leading-[100%] tracking-[0] font-normal font-alata text-[#818181]">
                        Prediction
                      </span>
                      </div>
                    <div
                      className="grid grid-cols-3 items-center py-2 text-center w-full"
                      style={{ gridTemplateColumns: "30% 40% 30%" }}
                    >
                      <span className="text-[15px] leading-[100%] tracking-[0] font-normal font-alata text-[#818181]">
                      {market.endTime &&
                        new Date(Number(market?.endTime) * 1000)
                          .toISOString()
                          .split("T")[0]}
                      </span>
                      <span className="text-[15px] leading-[100%] tracking-[0] font-normal font-alata text-[#818181]">
                       <div className="flex flex-row gap-2 justify-center align-center">
                        <Image
                        height={16}
                        width={16}
                        src="/assets/logos/usdc.svg"
                        alt="USDC"
                      />
                      {Number(item.shares / 10 ** 6).toFixed(3)}
                      </div>
                      </span>
                      <span
                        style={{
                          color: item.outcomeIndex ? "#FA7d22" : "#1C9EE9",
                        }}
                      >
                        {item.outcome}
                      </span>
                      </div>
                    
                  </div>
                )}
              </>
            );
          })
      ) : (
        <div className="flex flex-row justify-center align-center my-10">
          <span>No Active {open ? "Open" : "Closed"} Positions</span>
        </div>
      )}
    </>
  );
};
