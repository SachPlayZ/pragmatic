import { contractAbi, contractAddress } from "@/abi";
import { useWriteContract } from "wagmi";
import { parseEther } from "viem";
import { useState } from "react";

export default async function ListProperty({ price }: { price: number }) {
  const { writeContractAsync } = useWriteContract();
  const [transactionStatus, setTransactionStatus] = useState<string | null>(
    null
  );
  const [transactionHash, setTransactionHash] = useState<string | undefined>(
    undefined
  );

  try {
    const tx = await writeContractAsync(
      {
        address: contractAddress,
        abi: contractAbi,
        functionName: "listProperty",
        args: [parseEther(price.toString())],
      },
      {
        onSuccess(data: any) {
          console.log("Transaction successful!", data);
          setTransactionStatus("Transaction submitted!");
          setTransactionHash(data?.hash);
        },
        onSettled(data: any, error: any) {
          if (error) {
            setTransactionStatus("Transaction failed.");
            console.error("Error on settlement:", error);
          } else {
            console.log("Transaction settled:", data);
            setTransactionStatus("Transaction confirmed!");
            setTransactionHash(data?.hash);
          }
        },
      }
    );
    if (tx) {
      console.log("Transaction hash:", tx);
      setTransactionHash(tx);
      setTransactionStatus("Transaction confirmed!");
    }
  } catch (error) {
    console.error("Error submitting transaction:", error);
    setTransactionStatus("Transaction failed.");
  }
}
