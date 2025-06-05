/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useRef, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useWriteContract } from "wagmi";

import { Loader2 } from "lucide-react";
import { abi } from "../ABI/abi";
import { CONTRACT_ADDRESS } from "@/constants/contract";
import { parseEther } from "viem";
import Modal from "@mui/material/Modal";
import { Grow } from "@mui/material";

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
  const { writeContract, data, error: contractError } = useWriteContract();
  const [enableQuery, setEnableQuery] = useState(false);
  const { toast } = useToast();

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
      setEnableQuery(true);
      writeContract({
        abi: abi,
        functionName: "buyShares",
        address: CONTRACT_ADDRESS,
        args: [BigInt(marketId), selectedOption === "A"],
        value: parseEther(amount.toString()),
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
                        share(s).
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
                            type="number"
                            placeholder="Enter amount"
                            value={amount}
                            onChange={(e) => {
                              const value = Math.max(0, Number(e.target.value));
                              setAmount(value.toString());
                              setError(null);
                            }}
                            onKeyDown={(e) => {
                              if (e.key === "-" || e.key === "e")
                                e.preventDefault();
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
                        <button
                          onClick={() => {
                            if (Number(amount)> 0) {
                              setBuyingStep("confirm");
                            } else {
                              setError("Enter a valid amount greater than 0");
                            }
                          }}
                          className="bg-blue-900 text-blue-100 rounded-full px-4 py-2 font-semibold hover:bg-blue-600"
                        >
                          Proceed
                        </button>
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
