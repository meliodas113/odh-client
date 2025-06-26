// /import { abi } from "@/components/ABI/abi"
// import { useWalletStore } from "@/store/WalletStore"
// import { useAccount, useReadContract } from "wagmi"
// import { useShallow } from "zustand/react/shallow"


// export const useFetchUserPostions=()=>{
//     const {
//         contractAddress
//     }=useWalletStore(useShallow((state)=>({
//         contractAddress:state.contractAddress
//     })))
//     const {
//         isConnected,
//         address
//     }=useAccount();
//     const {
//         data,
//         isError
//     }=useReadContract({
//         abi:abi,
//         address:contractAddress as `0x${string}`,
//         functionName:"",
//         args:[

//         ],
//         query:{
//             enabled:isConnected
//         }
//     })
// }/