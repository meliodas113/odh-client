'use client'

import { ConnectButton, lightTheme, useReadContract } from 'thirdweb/react'
import { client } from '@/app/client'
import { baseSepolia } from 'thirdweb/chains'
import { MarketCard } from './marketCard'
import { contract } from '@/constants/contract'

export function EnhancedPredictionMarketDashboard() {
  const { data: marketCount, isLoading: isLoadingMarketCount } = useReadContract({
    contract,
    method: "function marketCount() view returns (uint256)",
    params: []
  }); 

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Prediction Market Dashboard</h1>
        <ConnectButton 
          client={client} 
          theme={lightTheme()}
          chain={baseSepolia}
          connectButton={{
            style: {
              fontSize: '0.75rem !important',
              height: '2.5rem !important',
            },
            label: 'Sign In',
          }}
          detailsButton={{
            displayBalanceToken: {
              [baseSepolia.id]: "0x4D9604603527322F44c318FB984ED9b5A9Ce9f71"
            }
          }}
        />
      </div>
      {isLoadingMarketCount ? (
        <div className="flex justify-center items-center">
          <div className="loader"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {Array.from({ length: Number(marketCount) }, (_, index) => (
            <MarketCard key={index} index={index} />
          ))}
        </div>
      )}
    </div>
  )
}
