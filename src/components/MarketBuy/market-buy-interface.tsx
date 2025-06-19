/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useRef, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useWriteContract, useEstimateGas } from "wagmi";
import { Loader2 } from "lucide-react";
import { abi } from "../ABI/abi";
import { DEFAULT_GAS_PERCENTAGE } from "@/lib/contract";
import { parseEther, parseUnits } from "viem";
import Modal from "@mui/material/Modal";
import { Grow } from "@mui/material";
import { useAccount } from "wagmi";
import { estimateGas } from "@wagmi/core";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { config } from "@/Provider/Web3provider";
import { encodeFunctionData } from "viem";
import { etherlink } from "viem/chains";
import Image from "next/image";
import { useWalletStore } from "@/store/WalletStore";
import { useShallow } from "zustand/react/shallow";
import { write } from "fs";
import { USDC_ABI } from "../ABI/usdc_abi";

interface MarketBuyInterfaceProps {
  question: string;
  marketId: number;
  market: {
    optionA: string;
    optionB: string;
    question: string;
  };
}

type BuyingStep = "initial" | "allowance" | "confirm";
type Option = "A" | "B" | null;

export function MarketBuyInterface({
  marketId,
  market,
  question,
}: MarketBuyInterfaceProps) {
  const { writeContract, data } = useWriteContract();
  const {} = useEstimateGas();
  const [enableQuery, setEnableQuery] = useState<boolean>(false);
  const { toast } = useToast();
  const { address } = useAccount();
  const {
    contractAddress,
    chainId,
    usdcAddress
  }=useWalletStore(useShallow((state)=>({
    contractAddress:state.contractAddress,
    chainId:state.selectedChain,
    usdcAddress:state.usdcAddress
  })))
  const [isBuying, setIsBuying] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [containerHeight, setContainerHeight] = useState("auto");
  const contentRef = useRef<HTMLDivElement>(null);

  const [selectedOption, setSelectedOption] = useState<Option>(null);
  const [amount, setAmount] = useState<string>("");
  const [buyingStep, setBuyingStep] = useState<BuyingStep>("initial");
  const [isConfirming, setIsConfirming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (data) {
      const formattedHash = `${data.slice(0, 15)}...${data.slice(-4)}`;
      toast({
        title: "Purchase Successful!",
        description: `You bought ${amount} ${
          selectedOption === "A" ? market.optionA : market.optionB
        } shares \n ${formattedHash}`,
        duration: 5000,
        style: {
          backgroundColor: "#0F172A",
          color: "#A3BFFA",
          fontSize: "12px",
        },
      });
      handleCancel();
    }
  }, [data]);

  useEffect(() => {
    if (contentRef.current) {
      setTimeout(() => {
        setContainerHeight(`${contentRef.current?.offsetHeight || 0}px`);
      }, 0);
    }
  }, [isBuying, buyingStep, isVisible, error]);

  const handleBuy = (option: Option) => {
    setIsVisible(false);
    setTimeout(() => {
      setIsBuying(true);
      setSelectedOption(option);
      setIsVisible(true);
    }, 200);
  };

  const handleCancel = () => {
    setIsVisible(false);
    setTimeout(() => {
      setIsBuying(false);
      setBuyingStep("initial");
      setSelectedOption(null);
      setAmount("");
      setError(null);
      setIsVisible(true);
    }, 200);
  };

  const handleConfirm = async () => {
    if (!selectedOption || Number(amount) <= 0) {
      setError("Must select an option and enter an amount greater than 0");
      return;
    }
    setIsConfirming(true);
    try {
      const data = encodeFunctionData({
        abi: abi,
        functionName: "buyShares",
        args: [BigInt(marketId), selectedOption === "A"],
      });
      const gasResult = await estimateGas(config, {
        chainId: etherlink.id,
        value: parseEther(amount.toString()),
        to: contractAddress as `0x${string}`,
        data: data,
      });
      setEnableQuery(true);
      writeContract({
        abi:USDC_ABI,
        address:usdcAddress as `0x${string}`,
        functionName:'approve',
        args: [
          contractAddress,
          parseUnits(amount, 6)
        ]
      })
      writeContract({
        abi: abi,
        functionName: "buyShares",
        address: contractAddress as `0x${string}`,
        args: [
          BigInt(marketId), 
          selectedOption === "A",
          parseUnits(amount, 6)
        ],
        gas: gasResult
          ? (((gasResult * BigInt(DEFAULT_GAS_PERCENTAGE)) /
              BigInt(100)) as bigint)
          : undefined,
        chainId:chainId
      });
      setEnableQuery(false);
    } catch (error) {
      setEnableQuery(false);
      toast({
        title: "Purchase Failed",
        description: "There was an error processing your purchase",
        variant: "destructive",
      });
    } finally {
      setIsConfirming(false);
    }
  };

  return (
    <div className="relative transition-all overflow-hidden rounded-lg bg-[#161b2e] shadow-md max-w-full">
      <div
        ref={contentRef}
        className={`w-full p-2 sm:p-3 md:p-4 transition-all ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        {!isBuying ? (
          <div className="flex gap-4 w-full">
            <button
              className="flex-1 text-sm font-semibold uppercase tracking-wide bg-[#245db9] text-[#c7d9fe] rounded-md px-4 py-2 hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-[#4f46e5]"
              onClick={() => handleBuy("A")}
              aria-label={`Vote ${market.optionA} for \"${market.question}\"`}
            >
              {market.optionA}
            </button>
            <button
              className="flex-1 text-sm font-semibold uppercase tracking-wide bg-[#245db9] text-[#c7d9fe] rounded-md px-4 py-2 hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-[#4f46e5]"
              onClick={() => handleBuy("B")}
              aria-label={`Vote ${market.optionB} for \"${market.question}\"`}
            >
              {market.optionB}
            </button>
          </div>
        ) : (
          <Modal open={isBuying}>
            <Grow in={isBuying}>
              <div className="flex flex-col items-center justify-center w-full h-full p-4">
                <div className="bg-[#0D1B2A] max-w-md w-full rounded-xl p-6 space-y-4 border border-[#374151]">
                  {buyingStep === "confirm" ? (
                    <>
                      <h2 className="text-xl font-bold text-white">
                        Confirm Transaction
                      </h2>
                      <p className="text-[#A3BFFA]">
                        You are about to buy
                        <span className="font-semibold text-blue-500">
                          {" "}
                          {amount}{" "}
                          {selectedOption === "A"
                            ? market.optionA
                            : market.optionB}{" "}
                        </span>
                        worth of share(s).
                      </p>
                      <div className="flex justify-center gap-4">
                        <button
                          onClick={handleCancel}
                          className="bg-white text-[#0A1A2F] border border-[#374151] rounded-full px-4 py-2 font-semibold hover:bg-[#E0F2FE] disabled:opacity-60"
                          disabled={isConfirming}
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleConfirm}
                          className="bg-blue-900 text-blue-100 rounded-full px-4 py-2 font-semibold hover:bg-blue-600 disabled:opacity-60 disabled:cursor-not-allowed"
                          disabled={isConfirming}
                        >
                          {isConfirming ? (
                            <div className="flex items-center">
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              <span>Confirming...</span>
                            </div>
                          ) : (
                            "Confirm"
                          )}
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <h3 className="text-lg font-bold text-white">
                        {question}
                      </h3>
                      <div className="flex flex-col gap-2">
                        <label
                          htmlFor="amount-input"
                          className="text-sm font-semibold text-blue-200"
                        >
                          Enter amount to buy:
                        </label>
                        <div className="flex items-center gap-3">
                          <input
                            id="amount-input"
                            type="text"
                            inputMode="decimal" 
                            placeholder="Enter amount in USD"
                            value={amount}
                            onChange={(e) => {
                              const inputValue = e.target.value;
                              if (inputValue === "") {
                                setAmount("");
                                setError(null);
                                return;
                              }
                              const decimalRegex = /^(\d+\.?\d*|\.\d+)$/;

                              if (decimalRegex.test(inputValue)) {
                                const numValue = parseFloat(inputValue);
                                if (!isNaN(numValue) && numValue >= 0) {
                                  setAmount(inputValue);
                                  setError(null);
                                } else {
                                  setError(
                                    "Please enter a valid positive number"
                                  );
                                }
                              } else if (inputValue === ".") {
                                setAmount(inputValue);
                                setError(null);
                              }
                            }}
                            onKeyDown={(e) => {
                              const invalidKeys = ["-", "e", "E", "+"];
                              if (invalidKeys.includes(e.key)) {
                                e.preventDefault();
                              }
                              if (e.key === "." && amount.includes(".")) {
                                e.preventDefault();
                              }
                            }}
                            className={`w-full px-4 py-2 text-sm rounded-full border focus:outline-none ${
                              error
                                ? "border-red-600 ring-2 ring-red-400"
                                : "border-gray-600"
                            }`}
                            aria-invalid={error ? "true" : "false"}
                          />
                          <span className="text-white text-sm bg-blue-800 rounded-full px-3 py-1">
                            {selectedOption === "A"
                              ? market.optionA
                              : market.optionB}
                          </span>
                        </div>
                        {error && (
                          <div className="min-h-[1.25rem] text-sm text-red-500 font-medium">
                            ({error})
                          </div>
                        )}
                      </div>
                      <div className="flex justify-center gap-4 flex-col sm:flex-row">
                        <button
                          onClick={handleCancel}
                          className="bg-white text-[#0A1A2F] border border-[#374151] rounded-full px-4 py-2 font-semibold hover:bg-[#E0F2FE]"
                        >
                          Cancel
                        </button>
                        {address !== undefined ? (
                          <button
                            onClick={() => {
                              if (Number(amount) > 0) {
                                setBuyingStep("confirm");
                              } else {
                                setError("Enter a valid amount greater than 0");
                              }
                            }}
                            className="bg-blue-900 text-blue-100 rounded-full px-4 py-2 font-semibold hover:bg-blue-600"
                          >
                            Proceed
                          </button>
                        ) : (
                          <ConnectButton.Custom>
                            {({ openConnectModal, connectModalOpen }) => (
                              <button
                                onClick={openConnectModal}
                                className="bg-blue-900 text-blue-100 rounded-full px-4 py-2 font-semibold hover:bg-blue-600"
                              >
                                Connect Wallet
                              </button>
                            )}
                          </ConnectButton.Custom>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </Grow>
          </Modal>
        )}
      </div>
    </div>
  );
}
