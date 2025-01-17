import { motion } from "framer-motion";
import { Bookmark, Building2 } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useWriteContract } from "wagmi";
import { useState } from "react";
import { contractAbi, contractAddress } from "@/abi";
import { parseEther } from "viem";
import { handleClick } from "./functions/ListProperty";

export default function ListCard(props: any) {
  const { property } = props;
  const price = 1;
  const [transactionStatus, setTransactionStatus] = useState<string | null>(
    null
  );
  const [transactionHash, setTransactionHash] = useState<string | undefined>(
    undefined
  );
  const { writeContractAsync } = useWriteContract();

  async function handleClick() {
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

  return (
    <motion.div
      key={property.id}
      className="rounded-xl overflow-hidden border border-gray-700 bg-gray-900 text-white"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      <Card className="rounded-xl overflow-hidden border border-gray-700 bg-gray-900 text-white">
        {/* Image */}
        <div className="lg:aspect-[2] aspect-[16/9] w-full overflow-hidden">
          <img
            src={property.imageUrl}
            alt={property.name}
            className="h-full w-full object-cover object-center"
          />
        </div>

        {/* Content */}
        <CardContent className="p-4">
          {/* Title and Price */}
          <div className="mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <div>
              <h3 className="text-lg font-semibold">{property.name}</h3>
              <p className="text-sm text-gray-400">{property.location}</p>
            </div>
            <span className="mt-2 sm:mt-0 text-lg font-bold text-lime-400">
              ${property.price.toLocaleString()}
            </span>
          </div>

          {/* Details */}
          <div className="mb-4 flex flex-wrap items-center gap-3 text-sm text-gray-400">
            <span>{property.bedrooms} BHK</span>
            <span>•</span>
            <span>{property.sqft} sqft</span>
          </div>

          {/* Token Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-400">
            <div className="flex items-center">
              <span>Token Price:</span>
              <span className="font-medium text-lime-400 flex gap-1 items-center">
                <img
                  src="/avax_lime.svg"
                  alt="coin"
                  className="w-4 h-4 ml-2 items-center mt-1"
                />
                {property.tokenPrice}
              </span>
            </div>
            <div className="justify-self-start sm:justify-self-end">
              <span>Available:</span>
              <span className="ml-1 font-medium text-lime-400">
                {property.availableTokens} tokens
              </span>
            </div>
          </div>
        </CardContent>

        {/* Footer */}
        <CardFooter className="flex flex-wrap items-center gap-2 p-4 pt-1">
          <Button
            className="flex-1 bg-lime-400 text-black hover:bg-lime-500 text-sm"
            disabled={property.availableTokens === 0}
            onClick={() => handleClick()}
          >
            Invest
          </Button>
          <Button
            variant="outline"
            size="icon"
            className={`${
              property.availableTokens === 0
                ? "text-gray-600 "
                : "text-lime-400 border-lime-400 bg-gray-900 hover:text-lime-500 hover:bg-gray-800"
            }`}
            disabled={property.availableTokens === 0}
          >
            <Building2 className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant="outline"
            className="text-lime-400 border-lime-400 hover:text-lime-400 bg-gray-900 hover:bg-gray-800"
          >
            <Bookmark className="h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
