import { contractAbi, contractAddress } from "@/abi";
import { motion } from "framer-motion";
import { Home, Maximize2 } from "lucide-react";
import { useState } from "react";
import { useWriteContract } from "wagmi";

export default function PropertyCard({ property }: any) {
  const { writeContractAsync } = useWriteContract();
  const [transactionStatus, setTransactionStatus] = useState("");

  async function handleBuy(id: number) {
    console.log(`Buying property with id: ${id}`);
    try {
      console.log(typeof property.resalePrice);
      const tx = await writeContractAsync(
        {
          address: contractAddress,
          abi: contractAbi,
          functionName: "buyProperty",
          args: [id],
          value: BigInt(property.resalePrice),
        },
        {
          onSuccess(data: any) {
            console.log("Transaction successful!", data);
            setTransactionStatus("Transaction submitted!");
          },
          onSettled(data: any, error: any) {
            if (error) {
              setTransactionStatus("Transaction failed.");
              console.error("Error on settlement:", error);
            } else {
              console.log("Transaction settled:", data);
              setTransactionStatus("Transaction confirmed!");
            }
          },
        }
      );
      if (tx) {
        console.log("Transaction hash:", tx);
        setTransactionStatus("Transaction confirmed!");
      }
    } catch (error) {
      console.error("Error submitting transaction:", error);
      setTransactionStatus("Transaction failed.");
    }
  }

  return (
    <div className="backdrop-blur-lg bg-white/10 rounded-2xl overflow-hidden border border-white/20 w-full h-[220px] flex flex-col sm:flex-row">
      <div className="w-full sm:w-1/2 h-1/2 sm:h-full overflow-hidden">
        <img
          src={property.image}
          alt={property.name}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="w-full sm:w-1/2 p-4 flex flex-col justify-between">
        <div>
          <h2 className="text-xl font-bold text-white mb-2">{property.name}</h2>
          <div className="flex flex-col gap-1">
            <div className="flex items-center text-white/80 text-sm">
              <Home className="w-4 h-4 mr-2" />
              <span>{property.type}</span>
            </div>
            <div className="flex items-center text-white/80 text-sm">
              <Maximize2 className="w-4 h-4 mr-2" />
              <span>{property.area} sqft</span>
            </div>
          </div>
        </div>
        <div>
          <div className="h-px bg-gradient-to-r from-[#D0FD3E] to-[#9EF01A] my-2" />
          <div className="flex justify-between gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex-1 bg-gradient-to-r from-[#D0FD3E]/10 to-[#9EF01A]/10 border border-[rgb(208,253,62)] text-[#D0FD3E] px-2 py-1 rounded-lg font-medium hover:bg-[#D0FD3E]/20 transition-all text-center text-sm flex items-center justify-center"
            >
              Rent: {property.rentPrice}{" "}
              <img src="/avax_lime.svg" alt="coin" className="w-4 h-4 ml-1" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex-1 bg-gradient-to-r from-[#D0FD3E] to-[#9EF01A] text-[#0A1A1F] px-2 py-1 rounded-lg font-medium hover:shadow-lg hover:shadow-[#D0FD3E]/20 transition-all text-center text-sm flex items-center justify-center"
              onClick={() => handleBuy(property.id)}
              disabled={transactionStatus === "Transaction submitted!"}
            >
              {transactionStatus === "Transaction submitted!" ? (
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              ) : (
                <>
                  Buy: {Number(property.resalePrice.toString()) / 10 ** 18}{" "}
                  <img
                    src="/avax_black.svg"
                    alt="coin"
                    className="w-4 h-4 ml-1"
                  />
                </>
              )}
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
}
