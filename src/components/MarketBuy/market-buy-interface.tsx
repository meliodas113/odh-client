/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useRef, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useWriteContract } from "wagmi";
import { abi } from "../ABI/abi";
import { CONTRACT_ADDRESS } from "@/constants/contract";
import { parseEther } from "viem";
import Modal from '@mui/material/Modal';
import "./styles.css";

interface MarketBuyInterfaceProps {
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


  useEffect(()=>{
    console.log("Showing the toast",data)
    if(data){
      const formattedHash = `${data.slice(0, 15)}...${data.slice(-4)}`;
      toast({
        title: "Purchase Successful!",
        description: `You bought ${amount} ${
          selectedOption === "A" ? market.optionA : market.optionB
        } shares \n
         ${formattedHash}
         `,
        duration: 5000,
        style:{
         backgroundColor:"#1e3a8a",
         color:"#fff",
         fontSize:"12px"
        },
      }
      );
    handleCancel();
  }
  },[data]);


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
          <Modal
         open={isBuying}
>
  <div className="market-buying-container">
  {buyingStep === "confirm" ? (
              <div className="market-confirm-box">
                <h2 className="confirm-title">Confirm Transaction</h2>
                <p className="confirm-description">
                  You are about to buy{" "}
                  <span className="highlight-text">
                    {amount}{" "}
                    {selectedOption === "A" ? market.optionA : market.optionB}
                  </span>{" "}
                  share(s).
                </p>
                <div className="action-buttons">
                  <button
                    onClick={handleCancel}
                    className="cancel-button"
                    disabled={isConfirming}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirm}
                    className="confirm-button"
                    disabled={isConfirming}
                  >
                    {isConfirming ? (
                      <div className="loader-container">
                        <Loader2 className="loader-icon" />
                        <span>Confirming...</span>
                      </div>
                    ) : (
                      "Confirm"
                    )}
                  </button>
                </div>
              </div>
            ) : (
              <div className="market-input-container">
                <div className="amount-input-group">
                  <label htmlFor="amount-input" className="amount-label">
                    Enter amount to buy:
                  </label>
                  <div className="amount-input-wrapper">
                    <div className="input-container">
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
                          if (e.key === "-" || e.key === "e") {
                            e.preventDefault();
                          }
                        }}
                        className={error ? "error-input" : ""}
                        aria-invalid={error ? "true" : "false"}
                      />
                    </div>
                    <span className="option-badge">
                      {selectedOption === "A" ? market.optionA : market.optionB}
                    </span>
                  </div>
                  {error && (
                    <div className="error-container">
                      (<span className="error-message">{error}</span>)
                    </div>
                  )}
                </div>
                <div className="action-buttons">
                  <button onClick={handleCancel} className="cancel-button">
                    Cancel
                  </button>
                  <button
                    className="proceed-button"
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
</Modal>
        )}
      </div>
    </div>
  );
}

