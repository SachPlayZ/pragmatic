import { contractAbi, contractAddress } from "@/abi";
import { useReadContract } from "wagmi";

export default function GetPropOnSale() {
  return useReadContract({
    address: contractAddress,
    abi: contractAbi,
    functionName: "getPropertiesOnSale",
    args: [],
  });
}
