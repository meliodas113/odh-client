/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useRef, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useWriteContract } from "wagmi";
import { abi } from "../ABI/abi";
import { CONTRACT_ADDRESS } from "@/constants/contract";
import { parseEther } from "viem";
import Modal from "@mui/material/Modal";
import "./styles.css";
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

// Type aliases for better readability
type BuyingStep = "initial" | "allowance" | "confirm";
type Option = "A" | "B" | null;

export function MarketBuyInterface({
  marketId,
  market,
  question,
}: MarketBuyInterfaceProps) {
  // Blockchain interactions
  const { writeContract, data, error: contractError } = useWriteContract();
  const [enableQuery, setEnableQuery] = useState<boolean>(false);
  const { toast } = useToast();

  const [isBuying, setIsBuying] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [containerHeight, setContainerHeight] = useState("auto");
  const contentRef = useRef<HTMLDivElement>(null);

  const [selectedOption, setSelectedOption] = useState<Option>(null);
  const [amount, setAmount] = useState(0);
  const [buyingStep, setBuyingStep] = useState<BuyingStep>("initial");
  const [isConfirming, setIsConfirming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log("Showing the toast", data);
    if (data) {
      const formattedHash = `${data.slice(0, 15)}...${data.slice(-4)}`;
      toast({
        title: "Purchase Successful!",
        description: `You bought ${amount} ${
          selectedOption === "A" ? market.optionA : market.optionB
        } shares \n
         ${formattedHash}
         `,
        duration: 5000,
        style: {
          backgroundColor: "#1e3a8a",
          color: "#fff",
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

  const handleBuy = (option: "A" | "B") => {
    setIsVisible(false);
    console.log("Trying to buy shares");
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
      setAmount(0);
      setError(null);
      setIsVisible(true);
    }, 200);
  };

  const handleConfirm = async () => {
    if (!selectedOption || amount <= 0) {
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
      console.error("Purchase error:", error);
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
    <div className="market-container">
      <div
        ref={contentRef}
        className={`market-content ${isVisible ? "visible" : "hidden"}`}
      >
        {!isBuying ? (
          <div className="market-buttons">
            <button
              className="market-option-button"
              onClick={() => handleBuy("A")}
              aria-label={`Vote ${market.optionA} for "${market.question}"`}
            >
              {market.optionA}
            </button>
            <button
              className="market-option-button"
              onClick={() => handleBuy("B")}
              aria-label={`Vote ${market.optionB} for "${market.question}"`}
            >
              {market.optionB}
            </button>
          </div>
        ) : (
          <Modal open={isBuying}>
            <Grow in={isBuying}>
              <div className="flex flex-col items-center justify-center w-full h-full p-4">
                {buyingStep === "confirm" ? (
                  <div className="bg-[#0D1B2A] max-w-md w-full rounded-xl p-6 space-y-4 border border-[#374151]">
                    <h2 className="text-xl font-bold text-[#F3F4F6]">
                      Confirm Transaction
                    </h2>
                    <p className="text-[#A3BFFA]">
                      You are about to buy
                      <span className="font-semibold text-[#3B82F6]">
                        {" "}
                        {amount}{" "}
                        {selectedOption === "A"
                          ? market.optionA
                          : market.optionB}
                      </span>{" "}
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
                        className="bg-[#1E3A8A] text-[#E0F2FE] rounded-full px-4 py-2 font-semibold hover:bg-[#3B82F6] disabled:opacity-60 disabled:cursor-not-allowed"
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
                  </div>
                ) : (
                  <div className="bg-[#0D1B2A] max-w-md w-full rounded-xl p-6 space-y-4 border border-[#374151]">
                    <h3 className="text-lg font-bold text-[#F3F4F6]">
                      {question}
                    </h3>
                    <div className="flex flex-col gap-2">
                      <label
                        htmlFor="amount-input"
                        className="text-sm font-semibold text-[#A3BFFA]"
                      >
                        Enter amount to buy:
                      </label>
                      <div className="flex items-center gap-3">
                        <div className="flex-grow relative">
                          <input
                            id="amount-input"
                            type="number"
                            min="0"
                            step="1"
                            placeholder="Enter amount"
                            value={amount || ""}
                            onChange={(e) => {
                              const value = Math.max(0, Number(e.target.value));
                              setAmount(value);
                              setError(null);
                            }}
                            onKeyDown={(e) => {
                              if (e.key === "-" || e.key === "e")
                                e.preventDefault();
                            }}
                            className={`w-full px-4 py-2 text-sm rounded-full border ${
                              error
                                ? "border-[#DC2626] focus:ring-2 ring-red-400"
                                : "border-[#374151]"
                            } focus:outline-none`}
                            aria-invalid={error ? "true" : "false"}
                          />
                        </div>
                        <span className="text-white text-sm bg-[#1E40AF] rounded-full px-3 py-1">
                          {selectedOption === "A"
                            ? market.optionA
                            : market.optionB}
                        </span>
                      </div>
                      {error && (
                        <div className="min-h-[1.25rem] text-sm text-[#DC2626] font-medium">
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
                        className="bg-[#1E3A8A] text-[#E0F2FE] rounded-full px-4 py-2 font-semibold hover:bg-[#3B82F6]"
                        onClick={() => {
                          if (amount > 0) {
                            setBuyingStep("confirm");
                          } else {
                            setError("Enter a valid amount greater than 0");
                          }
                        }}
                      >
                        Proceed
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </Grow>
          </Modal>
        )}
      </div>
    </div>
  );
}
