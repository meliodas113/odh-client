// /* eslint-disable @typescript-eslint/no-unused-vars */
// import { Button } from "./ui/button";
// import { Input } from "./ui/input";
// import { useState, useRef, useEffect } from "react";
// import { useSendTransaction } from "wagmi";
// import { Loader2 } from "lucide-react";
// import { cn } from "@/lib/utils";
// import { useToast } from "@/components/ui/use-toast";
// import { useWriteContract } from "wagmi";
// import { abi } from "./ABI/abi";
// import { CONTRACT_ADDRESS } from "@/constants/contract";
// import { parseEther } from "viem";
// interface MarketBuyInterfaceProps {
//   marketId: number;
//   market: {
//     optionA: string;
//     optionB: string;
//     question: string;
//   };
// }

// // Type aliases for better readability
// type BuyingStep = "initial" | "allowance" | "confirm";
// type Option = "A" | "B" | null;

// export function MarketBuyInterface({
//   marketId,
//   market,
// }: MarketBuyInterfaceProps) {
//   // Blockchain interactions
//   //const account = useActiveAccount();
//   const {
//     writeContract,
//     data,
//     error:contractError
// }=useWriteContract();
//    const [enableQuery, setEnableQuery] = useState<boolean>(false);
//   const { toast } = useToast();

//   const [isBuying, setIsBuying] = useState(false);
//   const [isVisible, setIsVisible] = useState(true);
//   const [containerHeight, setContainerHeight] = useState("auto");
//   const contentRef = useRef<HTMLDivElement>(null);

//   // Transaction state
//   const [selectedOption, setSelectedOption] = useState<Option>(null);
//   const [amount, setAmount] = useState(0);
//   const [buyingStep, setBuyingStep] = useState<BuyingStep>("initial");
//   const [isConfirming, setIsConfirming] = useState(false);

//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     if (contentRef.current) {
//       setTimeout(() => {
//         setContainerHeight(`${contentRef.current?.offsetHeight || 0}px`);
//       }, 0);
//     }
//   }, [isBuying, buyingStep, isVisible, error]);

//   const handleBuy = (option: "A" | "B") => {
//     setIsVisible(false);
//     console.log("Trying to buy shares")
//     setTimeout(() => {
//       setIsBuying(true);
//       setSelectedOption(option);
//       setIsVisible(true);
//     }, 200);
//   };

//   const handleCancel = () => {
//     setIsVisible(false);
//     setTimeout(() => {
//       setIsBuying(false);
//       setBuyingStep("initial");
//       setSelectedOption(null);
//       setAmount(0);
//       setError(null);
//       setIsVisible(true);
//     }, 200);
//   };

//   const handleConfirm = async () => {
//     console.log("The amount is",amount,enableQuery)
//     if (!selectedOption || amount <= 0) {
//       setError("Must select an option and enter an amount greater than 0");
//       return;
//     }
//     setIsConfirming(true);
//     try {
//       setEnableQuery(true)
//       writeContract({
//         abi:abi,
//         functionName:"buyShares",
//         address:CONTRACT_ADDRESS,
//         args:[
//             BigInt(marketId),
//             selectedOption==="A",
//         ],
//         value:parseEther(amount.toString())
//     })
//     setEnableQuery(false)
//       toast({
//         title: "Purchase Successful!",
//         description: `You bought ${amount} ${
//           selectedOption === "A" ? market.optionA : market.optionB
//         } shares`,
//         duration: 5000,
//       });
//       console.log("the contract error is",contractError)
//       handleCancel();
//     } catch (error) {
//       setEnableQuery(false)
//       console.log("The error is ",error)
//       toast({
//         title: "Purchase Failed",
//         description: "There was an error processing your purchase",
//         variant: "destructive",
//       });
//     } finally {
//       setIsConfirming(false);
//     }
//   };

//   return (
//     <div
//       className="relative transition-[height] duration-200 ease-in-out overflow-hidden"
//       style={{ height: containerHeight }}
//     >
//       <div
//         ref={contentRef}
//         className={cn(
//           "w-full transition-all duration-200 ease-in-out",
//           isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
//         )}
//       >
//         {!isBuying ? (
//           <div className="flex justify-between gap-4 mb-4">
//             <Button
//               className="flex-1"
//               onClick={() => {
//                 console.log("I got clicked")
//                 handleBuy("A")
//               }}
//               aria-label={`Vote ${market.optionA} for "${market.question}"`}
//               //disabled={!account}
//             >
//               {market.optionA}
//             </Button>
//             <Button
//               className="flex-1"
//               onClick={() => handleBuy("B")}
//               aria-label={`Vote ${market.optionB} for "${market.question}"`}
//               //disabled={!account}
//             >
//               {market.optionB}
//             </Button>
//           </div>
//         ) : (

//           <div className="flex flex-col mb-4">
//             { buyingStep === "confirm" ? (
//               <div className="flex flex-col border-2 border-gray-200 rounded-lg p-4">
//                 <h2 className="text-lg font-bold mb-4">Confirm Transaction</h2>
//                 <p className="mb-4">
//                   You are about to buy{" "}
//                   <span className="font-bold">
//                     {amount}{" "}
//                     {selectedOption === "A" ? market.optionA : market.optionB}
//                   </span>{" "}
//                   share(s).
//                 </p>
//                 <div className="flex justify-end">
//                   <Button
//                     onClick={handleConfirm}
//                     className="mb-2"
//                     disabled={isConfirming}
//                   >
//                     {isConfirming ? (
//                       <>
//                         <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                         Confirming...
//                       </>
//                     ) : (
//                       "Confirm"
//                     )}
//                   </Button>
//                   <Button
//                     onClick={handleCancel}
//                     className="ml-2"
//                     variant="outline"
//                     disabled={isConfirming}
//                   >
//                     Cancel
//                   </Button>
//                 </div>
//               </div>
//             ) : (
//               <div className="flex flex-col">
//                 <div className="flex flex-col gap-1 mb-4">
//                   <div className="flex items-center gap-2 overflow-visible">
//                     <div className="flex-grow relative">
//                       <Input
//                         type="number"
//                         min="0"
//                         step="1"
//                         placeholder="Enter amount"
//                         value={amount}
//                         onChange={(e) => {
//                           const value = Math.max(0, Number(e.target.value));
//                           setAmount(value);
//                           setError(null);
//                         }}
//                         onKeyDown={(e) => {
//                           if (e.key === "-" || e.key === "e") {
//                             e.preventDefault();
//                           }
//                         }}
//                         className={cn(
//                           "w-full",
//                           error && "border-red-500 focus-visible:ring-red-500"
//                         )}
//                       />
//                     </div>
//                     <span className="font-bold whitespace-nowrap">
//                       {selectedOption === "A" ? market.optionA : market.optionB}
//                     </span>
//                   </div>
//                   <div className="min-h-[20px]">
//                     {error && (
//                       <span className="text-sm text-red-500">{error}</span>
//                     )}
//                   </div>
//                 </div>
//                 <div className="flex justify-between gap-4">
//                   <Button
//                   className="flex-1"
//                   onClick={() => {
//                     if (amount > 0) {
//                       setBuyingStep("confirm");
//                     } else {
//                       setError("Enter a valid amount greater than 0");
//                     }
//                   }}
//                   >
//                     Confirm
//                   </Button>
//                   <Button
//                     onClick={handleCancel}
//                     variant="outline"
//                     className="flex-1"
//                   >
//                     Cancel
//                   </Button>
//                 </div>
//               </div>
//             )}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useRef, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useWriteContract } from "wagmi";
import { abi } from "../ABI/abi";
import { CONTRACT_ADDRESS } from "@/constants/contract";
import { parseEther } from "viem";
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
      toast({
        title: "Purchase Successful!",
        description: `You bought ${amount} ${
          selectedOption === "A" ? market.optionA : market.optionB
        } shares`,
        duration: 5000,
      });
      handleCancel();
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
        )}
      </div>
    </div>
  );
}
