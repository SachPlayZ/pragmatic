import { contractAbi, contractAddress } from "@/app/abi";
import { useWriteContract } from "wagmi";

export default async function GetReturn({ propId }: { propId: number }) {
  const { writeContractAsync } = useWriteContract();

  return await writeContractAsync({
    address: contractAddress,
    abi: contractAbi,
    functionName: "burnTokensFromProperty",
    args: [propId],
  });
}
