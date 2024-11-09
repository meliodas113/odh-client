import { ConnectButton, lightTheme } from "thirdweb/react";
import { client } from "@/app/client";
import { baseSepolia } from "thirdweb/chains";

export function Navbar() {
    return (
        <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Simple Prediction Market</h1>
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
    );
}
