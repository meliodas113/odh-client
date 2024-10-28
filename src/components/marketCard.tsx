import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { prepareContractCall, readContract, toEther, toWei } from "thirdweb";
import { Progress } from "@/components/ui/progress";
import { Button } from "./ui/button";
import { useEffect, useState } from "react";
import { Input } from "./ui/input";
import { useActiveAccount, useReadContract, useSendAndConfirmTransaction } from "thirdweb/react";
import { contract, tokenContract } from "@/constants/contract";
import { approve } from "thirdweb/extensions/erc20";

interface MarketCardProps {
  index: number;
}

const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    })
}

const toFixed = (value: number, decimals: number) => {
    return value.toFixed(decimals);
}


export function MarketCard({ index }: MarketCardProps) {
    const { data: market, isLoading: isLoadingMarketData } = useReadContract({
        contract,
        method: "function getMarketInfo(uint256 _marketId) view returns (string question, string optionA, string optionB, uint256 endTime, uint8 outcome, uint256 totalOptionAShares, uint256 totalOptionBShares, bool resolved)",
        params: [BigInt(index)]
    });

    const totalShares = Number(market?.[5]) + Number(market?.[6]);
    const yesPercentage = (Number(market?.[5]) / totalShares) * 100;
    const [isBuying, setIsBuying] = useState(false);
    const [selectedOption, setSelectedOption] = useState<'A' | 'B' | null>(null);
    const [amount, setAmount] = useState<number>(0);
    const [buyingStep, setBuyingStep] = useState<'initial' | 'allowance' | 'confirm'>('initial');

    const account = useActiveAccount();
    const { mutateAsync: mutateTransaction } = useSendAndConfirmTransaction();

    const { data: sharesBalance } = useReadContract({
        contract,
        method: "function getSharesBalance(uint256 _marketId, address _user) view returns (uint256 optionAShares, uint256 optionBShares)",
        params: [BigInt(index), account?.address as string]
    });

    const [winnings, setWinnings] = useState<{ A: number; B: number }>({ A: 0, B: 0 });

    const calculateWinnings = (option: 'A' | 'B') => {
        const userShares = option === 'A' ? Number(sharesBalance?.[0]) : Number(sharesBalance?.[1]);
        const totalSharesForOption = option === 'A' ? Number(market?.[5]) : Number(market?.[6]);
        const totalShares = totalSharesForOption + (option === 'A' ? Number(market?.[6]) : Number(market?.[5]));

        if (totalShares === 0) return 0; // Avoid division by zero

        const winnings = (userShares / totalShares) * (option === 'A' ? totalSharesForOption : totalSharesForOption); // Calculate winnings based on the user's shares
        return winnings + userShares;
    };

    const updateWinnings = () => {
        setWinnings({
            A: calculateWinnings('A'),
            B: calculateWinnings('B'),
        });
    };

    useEffect(() => {
        updateWinnings();
    }, [sharesBalance, market]);

    const winningsA = winnings.A;
    const winningsB = winnings.B;

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (Number(value) >= 0) {
            setAmount(Number(value));
        }
    }

    const handleBuy = (option: 'A' | 'B') => {
        setIsBuying(true);
        setSelectedOption(option);
    };

    const checkApproval = async () => {
        if (amount > 0) {
            try {
                const userAllowance = await readContract({
                    contract: tokenContract,
                    method: "function allowance(address owner, address spender) view returns (uint256)",
                    params: [account?.address as string, contract.address]
                });

                if (userAllowance < BigInt(toWei(amount.toString()))) {
                    setBuyingStep('allowance');
                } else {
                    setBuyingStep('confirm');
                }
            } catch (error) {
                console.error(error);
            }
        } else {
            alert("Must enter an amount greater than 0");
        }
    }

    const handleConfirm = async () => {
        if (selectedOption && amount > 0) {
            try {
                const tx = await prepareContractCall({
                    contract: contract,
                    method: "function buyShares(uint256 _marketId, bool _isOptionA, uint256 _amount)",
                    params: [BigInt(index), selectedOption === 'A', BigInt(toWei(amount.toString()))]
                });

                await mutateTransaction(tx);
            } catch (error) {
                console.error(error);
            } finally {
                setIsBuying(false);
                setBuyingStep('initial');
                setSelectedOption(null);
                setAmount(0);
            }
        } else {
            alert("Must select an option and enter an amount greater than 0");
        }
    };

    const handleSetApproval = async () => {
        try {
            const tx = await approve({
                contract: tokenContract,
                spender: contract.address,
                amount: amount
            });

            await mutateTransaction(tx);
            setBuyingStep('confirm');
        } catch (error) {
            console.error(error);
        }
    };

    const handleCancel = () => {
        setIsBuying(false);
        setBuyingStep('initial');
        setSelectedOption(null);
        setAmount(0);
    }

    const handleClaimRewards = async () => {
        try {
            const tx = await prepareContractCall({
                contract,
                method: "function claimWinnings(uint256 _marketId)",
                params: [BigInt(index)]
            });

            await mutateTransaction(tx);
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <Card key={index} className="flex flex-col">
            {isLoadingMarketData ? (
                <div className="animate-pulse">
                    <CardHeader>
                        <Badge variant="secondary" className="mb-2 bg-gray-200 h-4 w-1/2"></Badge>
                        <CardTitle className="bg-gray-200 h-6 w-1/3"></CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="mb-4">
                            <div className="flex justify-between mb-2">
                                <span className="bg-gray-200 h-4 w-1/4"></span>
                                <span className="bg-gray-200 h-4 w-1/4"></span>
                            </div>
                            <Progress value={0} className="h-2 bg-gray-200" />
                        </div>
                    </CardContent>
                </div>
            ) : (
                <>
                    <CardHeader>
                        {new Date(Number(market?.[3]) * 1000) < new Date() ? (
                            <Badge variant="secondary" className="mb-2 bg-red-200">
                                Ended: {formatDate(new Date(Number(market?.[3]) * 1000).toISOString())}
                            </Badge>
                        ) : (
                            <Badge variant="secondary" className="mb-2">
                                Ends: {formatDate(new Date(Number(market?.[3]) * 1000).toISOString())}
                            </Badge>
                        )}
                        
                        <CardTitle>{market?.[0]}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="mb-4">
                            <div className="flex justify-between mb-2">
                                <span><span className="font-bold text-sm">{market?.[1]}: {Math.floor(parseInt(toEther(BigInt(market?.[5] || "0"))))}</span>  <span className="text-xs text-gray-500">{Math.floor(yesPercentage)}%</span></span>
                                <span><span className="font-bold text-sm">{market?.[2]}: {Math.floor(parseInt(toEther(BigInt(market?.[6] || "0"))))}</span>  <span className="text-xs text-gray-500">{Math.floor(100 - yesPercentage)}%</span></span>
                            </div>
                            <Progress value={yesPercentage} className="h-2" />
                        </div>
                        {new Date(Number(market?.[3]) * 1000) < new Date() ? (
                            market?.[7] ? (
                                <>
                                    <div className="flex flex-col gap-2">
                                        <Badge variant="secondary" className="mb-2 bg-green-200">Resolved: {market?.[4] === 0 ? market?.[1] : market?.[2]}</Badge>
                                        <Button variant="outline" className="w-full" onClick={handleClaimRewards}>Claim Rewards</Button>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="flex flex-col gap-2">
                                        <Badge variant="secondary" className="mb-2 bg-yellow-200">Pending resolution</Badge>
                                    </div>
                                </>
                            )
                        ) : (
                            !isBuying ? (
                                <div className="flex justify-between gap-4 mb-4">
                                    <Button 
                                        className="flex-1" 
                                        onClick={() => handleBuy('A')}
                                        aria-label={`Vote ${market?.[1]} for "${market?.[0]}"`}
                                    >
                                        {market?.[1]}
                                    </Button>
                                    <Button 
                                        className="flex-1"
                                        onClick={() => handleBuy('B')}
                                        aria-label={`Vote ${market?.[2]} for "${market?.[0]}"`}
                                    >
                                        {market?.[2]}
                                    </Button>
                                </div>
                            ) : (
                                <div className="flex flex-col mb-4">
                                    {buyingStep === 'allowance' ? (
                                        <div className="flex flex-col border-2 border-gray-200 rounded-lg p-4">
                                            <h2 className="text-lg font-bold mb-4">Approval Needed</h2>
                                            <p className="mb-4">You need to approve the transaction before proceeding.</p>
                                            <div className="flex justify-end">
                                                <Button onClick={handleSetApproval} className="mb-2">
                                                    Set Approval
                                                </Button>
                                                <Button onClick={() => setBuyingStep('initial')} className="ml-2" variant="outline">
                                                    Cancel
                                                </Button>
                                            </div>
                                        </div>
                                    ) : buyingStep === 'confirm' ? (
                                        <div className="flex flex-col border-2 border-gray-200 rounded-lg p-4">
                                            <h2 className="text-lg font-bold mb-4">Confirm Transaction</h2>
                                            <p className="mb-4">You are about to buy <span className="font-bold">{amount} {selectedOption === 'A' ? market?.[1] : market?.[2]}</span> share(s).</p>
                                            <div className="flex justify-end">
                                                <Button onClick={handleConfirm} className="mb-2">
                                                    Confirm
                                                </Button>
                                                <Button onClick={() => setBuyingStep('initial')} className="ml-2" variant="outline">
                                                    Cancel
                                                </Button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col">
                                            <span className="text-xs text-gray-500 mb-1">{`1 ${selectedOption === 'A' ? market?.[1] : market?.[2]} = 1 PREDICT`}</span>
                                            <div className="flex items-center gap-2 mb-4">
                                                <Input
                                                    type="number"
                                                    placeholder="Enter amount"
                                                    value={amount}
                                                    onChange={(e) => handleInputChange(e)}
                                                    className="flex-grow"
                                                />
                                                <span className="font-bold">
                                                    {selectedOption === 'A' ? market?.[1] : market?.[2]}
                                                </span>
                                            </div>
                                            <div className="flex justify-between gap-4">
                                                <Button onClick={checkApproval} className="flex-1">
                                                    Confirm
                                                </Button>
                                                <Button onClick={handleCancel} variant="outline" className="flex-1">
                                                    Cancel
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )
                        )}
                    </CardContent>
                    <CardFooter>
                        <div className="flex flex-col gap-2">
                            <div className="w-full text-sm text-muted-foreground">
                                Your shares: {market?.[1]} - {Math.floor(parseInt(toEther(BigInt(sharesBalance?.[0] || "0"))))} , {market?.[2]} - {Math.floor(parseInt(toEther(BigInt(sharesBalance?.[1] || "0"))))}
                            </div>
                            {winningsA > 0 || winningsB > 0 ? (
                                <div className="flex gap-2">
                                    <Badge variant="secondary">{market?.[1]}: {toFixed(Number(toEther(BigInt(winningsA))), 2)}</Badge>
                                    <Badge variant="secondary">{market?.[2]}: {toFixed(Number(toEther(BigInt(winningsB))), 2)}</Badge>
                                </div>
                            ) : null}
                        </div>
                    </CardFooter>
                </>
            )}
        </Card>
    )
}