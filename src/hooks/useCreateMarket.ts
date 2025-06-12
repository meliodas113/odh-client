import { abi } from "@/components/ABI/abi";
import { useWriteContract } from "wagmi";
import { CONTRACT_ADDRESS } from "@/lib/contract";
import { useState } from "react";
interface Data {
  heading: string;
  category: string;
  outcome1: string;
  outcome2: string;
  deadline: number;
  image: string;
}

function useCreateMarket({
  heading,
  category,
  image,
  outcome1,
  outcome2,
  deadline,
}: Data) {
  const [enableQuery, setEnableQuery] = useState(false);
  const { writeContract, data, error: contractError } = useWriteContract();

  const timeleft = Math.floor((deadline - new Date().getTime()) / 1000);
  console.log(new Date().getTime());
  console.log(timeleft, deadline);
  console.log(contractError, enableQuery);

  const createMarket = async () => {
    try {
      setEnableQuery(true);
      writeContract({
        abi: abi,
        address: CONTRACT_ADDRESS,
        functionName: "createMarket",
        args: [heading, image, category, outcome1, outcome2, timeleft],
      });
      return data;
    } catch (err) {
      setEnableQuery(false);
      console.log(err);
    }
  };

  return { createMarket };
}

export default useCreateMarket;
