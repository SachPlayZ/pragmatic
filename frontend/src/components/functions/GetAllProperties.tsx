import { useReadContract } from "wagmi";
import { contractAbi, contractAddress } from "@/abi";

export function GetAllProperties() {
  return useReadContract({
    abi: contractAbi,
    address: contractAddress,
    functionName: "getAllProperties",
    args: [],
  });
}
