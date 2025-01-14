import { useReadContract } from "wagmi";
import { contractAbi, contractAddress } from "@/abi";
import { useState } from "react";

export function GetProperty({ id }: any) {
  //   const [propertyList, setPropertyList] = useState<any[]>([]);

  return useReadContract({
    abi: contractAbi,
    address: contractAddress,
    functionName: "getListingById",
    args: [id],
  });
}
