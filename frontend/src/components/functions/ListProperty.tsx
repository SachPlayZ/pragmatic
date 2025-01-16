import { useState } from "react";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { parseEther } from "viem";
import { contractAbi, contractAddress } from "@/abi";

// Types for the hook's parameters and return values
interface UsePropertyListingProps {
  price: number;
}

interface TransactionStatus {
  status: string;
  hash: string | null;
  error: Error | null;
}

// Configuration function to prepare the contract request
const useListingConfig = ({ price }: UsePropertyListingProps) => {
  return {
    listingRequest: {
      address: contractAddress as `0x${string}`,
      abi: contractAbi,
      functionName: "listProperty",
      args: [parseEther(price.toString())],
    },
  };
};

// Main hook for property listing functionality
export function usePropertyListing({ price }: UsePropertyListingProps) {
  // State management for transaction status
  const [transactionStatus, setTransactionStatus] = useState<TransactionStatus>(
    {
      status: "",
      hash: null,
      error: null,
    }
  );

  // Get contract configuration
  const { listingRequest } = useListingConfig({ price });

  // Contract write functionality
  const {
    data: submitTxData,
    error: submitTxError,
    isPending: loadingListing,
    isError: errorListing,
    isSuccess: successListing,
    writeContractAsync,
  } = useWriteContract();

  // Wait for transaction receipt
  const {
    isLoading: submitTxListingLoading,
    isSuccess: submitTxListingSuccess,
    error: submitConfirmTxListingError,
  } = useWaitForTransactionReceipt({
    confirmations: 1,
    hash: submitTxData,
  });

  // Function to handle the listing process
  const handleListing = async () => {
    try {
      if (!listingRequest) return;

      const tx = await writeContractAsync(listingRequest, {
        onSuccess(data: any) {
          setTransactionStatus({
            status: "Transaction submitted!",
            hash: data?.hash,
            error: null,
          });
        },
        onSettled(data: any, error: any) {
          if (error) {
            setTransactionStatus({
              status: "Transaction failed.",
              hash: null,
              error,
            });
          } else {
            setTransactionStatus({
              status: "Transaction confirmed!",
              hash: data?.hash,
              error: null,
            });
          }
        },
      });

      if (tx) {
        setTransactionStatus({
          status: "Transaction confirmed!",
          hash: tx,
          error: null,
        });
      }
    } catch (error) {
      setTransactionStatus({
        status: "Transaction failed.",
        hash: null,
        error: error as Error,
      });
    }
  };

  return {
    // Transaction state
    transactionStatus,

    // Loading states
    loadingListing,
    submitTxListingLoading,

    // Success states
    successListing,
    submitTxListingSuccess,

    // Error states
    errorListing,
    submitTxError,
    submitConfirmTxListingError,

    // Actions
    listProperty: handleListing,
  };
}
