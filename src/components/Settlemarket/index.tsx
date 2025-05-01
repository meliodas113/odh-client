import { useState } from "react";
import { Radio, RadioGroup } from "rsuite";
import useSettleMarket from "@/hooks/useSettleMarket";
import { useAccount } from "wagmi";

const SettleMarkets = () => {
  const [marketId, setMarketId] = useState<number>(0);
  const [outcome, setOutcome] = useState<string>("Yes");
  const { address } = useAccount();
  const { settleMarket } = useSettleMarket();

  const handleSettleMarket = () => {
    const outcomeValue = outcome === "Yes" ? 0 : 1;
    const categoryId = 2;
    
    settleMarket({
      marketId: marketId,
      winning_outcome: outcomeValue,
      categoryId: categoryId
    });
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Market ID
        </label>
        <input
          type="number"
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter market ID"
          value={marketId}
          onChange={(e) => setMarketId(parseInt(e.target.value) || 0)}
        />
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Winning Outcome
        </label>
        <div className="mt-2">
          <RadioGroup
            name="outcome"
            value={outcome}
            onChange={(value) => setOutcome(value as string)}
            defaultValue="Yes"
            inline
          >
            <Radio value="Yes">Yes</Radio>
            <Radio value="No">No</Radio>
          </RadioGroup>
        </div>
      </div>

      <div className="flex justify-center mt-8">
        {address ? (
          <button
            type="button"
            onClick={handleSettleMarket}
            className="py-3 px-8 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Settle Market
          </button>
        ) : (
            <button
            type="button"
            className="py-3 px-8 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Connect Wallet
          </button>
        )}
      </div>
    </div>
  );
};

export default SettleMarkets;