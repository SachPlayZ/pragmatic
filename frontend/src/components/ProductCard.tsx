import { contractAbi, contractAddress } from "@/abi";
import { motion } from "framer-motion";
import { Home, Maximize2 } from "lucide-react";
import { useState } from "react";
import { parseEther } from "viem";
import { useWriteContract } from "wagmi";

interface Property {
  id: number;
  name: string;
  image: string;
  type: string;
  area: number;
  rentPrice: number;
  salePrice: number;
}

interface PropertyCardProps {
  property: Property;
}

export default function PropertyCard({ property }: PropertyCardProps) {
  const { writeContractAsync } = useWriteContract();
  const [transactionStatus, setTransactionStatus] = useState("");
  const [transactionHash, setTransactionHash] = useState("");

  async function handleBuy(id: number) {
    console.log(`Buying property with id: ${id}`);
    try {
      const tx = await writeContractAsync(
        {
          address: contractAddress,
          abi: contractAbi,
          functionName: "buyProperty",
          args: [id],
          value: parseEther(property.salePrice.toString()),
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
              className="flex-1 bg-gradient-to-r from-[#D0FD3E]/10 to-[#9EF01A]/10 border border-[#D0FD3E] text-[#D0FD3E] px-2 py-1 rounded-lg font-medium hover:bg-[#D0FD3E]/20 transition-all text-center text-sm flex items-center justify-center"
            >
              Rent: {property.rentPrice}{" "}
              <img src="/avax_lime.svg" alt="coin" className="w-4 h-4 ml-1" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex-1 bg-gradient-to-r from-[#D0FD3E] to-[#9EF01A] text-[#0A1A1F] px-2 py-1 rounded-lg font-medium hover:shadow-lg hover:shadow-[#D0FD3E]/20 transition-all text-center text-sm flex items-center justify-center"
              onClick={() => handleBuy(property.id)}
            >
              Buy: {property.salePrice}{" "}
              <img src="/avax_black.svg" alt="coin" className="w-4 h-4 ml-1" />
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
}
