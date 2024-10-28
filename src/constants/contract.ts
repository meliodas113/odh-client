import { client } from "@/app/client";
import { getContract } from "thirdweb";
import { baseSepolia } from "thirdweb/chains";

export const contractAddress = "0x6e7E28B1f491ad9BB3D3F538eC005c6EadF453e1";
export const tokenAddress = "0x4D9604603527322F44c318FB984ED9b5A9Ce9f71";

export const contract = getContract({
    client: client,
    chain: baseSepolia,
    address: contractAddress
});

export const tokenContract = getContract({
    client: client,
    chain: baseSepolia,
    address: tokenAddress
});