import { useReadContract } from "wagmi";
import { contractAbi, contractAddress } from "@/app/abi";

export function GetAllProperties() {
  return useReadContract({
    abi: contractAbi,
    address: contractAddress,
    functionName: "getAllProperties",
    args: [],
  });
}
