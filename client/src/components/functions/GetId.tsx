import { useReadContract } from "wagmi";
import { contractAbi, contractAddress } from "@/abi";

export function GetId() {
  return useReadContract({
    abi: contractAbi,
    address: contractAddress,
    functionName: "getAllListings",
    args: [],
  });
}
