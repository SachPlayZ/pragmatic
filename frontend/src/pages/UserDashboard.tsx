"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Building2, BarChart3, ListChecks, Wallet } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { contractAddress, contractAbi } from "@/abi";
import { useAccount, useReadContract } from "wagmi";
import { formatEther } from "viem";
import { useState, useEffect } from "react";

// Define types for our contract return values
type DashboardStats = readonly [bigint, bigint, bigint]; // [multiplier, totalListings, totalSpentAVAX]

interface ListingInfo {
  propertyId: bigint;
  tokenPrice: bigint;
}

interface InvestmentInfo {
  propertyId: bigint;
  investmentAmount: bigint;
  proposedRate: bigint;
  actualRate: bigint;
  tokenPrice: bigint;
}

// Type for our dashboard items
interface DashboardItem {
  title: string;
  icon: React.ReactNode;
  span: string;
  height: string;
  content: React.ReactNode;
}

interface Property {
  id: number;
  owner: string;
  imageUrl: string;
  name: string;
  location: string;
  price: string;
  bedrooms: number;
  sqft: number;
}

export default function Dashboard() {
  const { address } = useAccount();
  const [avaxUsdPrice, setAvaxUsdPrice] = useState<number>(0);
  const [properties, setProperties] = useState<Property[]>([]);
  const [investmentProperties, setInvestmentProperties] = useState<Property[]>(
    []
  );

  // Fetch dashboard stats with proper typing
  const { data: dashboardStats, isLoading: loadingStats } = useReadContract({
    address: contractAddress,
    abi: contractAbi,
    functionName: "getDashboardStats",
    args: [address],
  }) as { data: DashboardStats | undefined; isLoading: boolean };
  async function getPropertiesByIds(ids: number[]) {
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/arrayofids`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ids }),
      }
    );
    const data = await response.json();
    return data as Property[]; // Assuming the response is an array of properties
  }

  // Fetch wallet listings with proper typing
  const { data: listings, isLoading: loadingListings } = useReadContract({
    address: contractAddress,
    abi: contractAbi,
    functionName: "getWalletListings",
    args: [address],
  }) as { data: ListingInfo[] | undefined; isLoading: boolean };

  // Fetch investments with proper typing
  const { data: investments, isLoading: loadingInvestments } = useReadContract({
    address: contractAddress,
    abi: contractAbi,
    functionName: "getWalletInvestments",
    args: [address],
  }) as { data: InvestmentInfo[] | undefined; isLoading: boolean };

  async function getListingsFromBackend(address: string) {
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/property/${address}`
    );
    const data = await response.json();
    return data as Property[]; // Assuming the response is an array of properties
  }
  // Calculate USD values when multiplier (AVAX price) changes
  useEffect(() => {
    if (dashboardStats) {
      // Convert the Chainlink price feed response to USD
      setAvaxUsdPrice(Number(dashboardStats[0]) / 1e8);
      if (address) {
        getListingsFromBackend(address).then((data) => setProperties(data));
      }
    }
  }, [dashboardStats, address]);
  useEffect(() => {
    if (investments) {
      const propertyIds = investments.map((investment) =>
        Number(investment.propertyId)
      );
      getPropertiesByIds(propertyIds).then((data) =>
        setInvestmentProperties(data)
      );
    }
  }, [investments]);
  // Add this right after the other contract function call hooks
  const { data: propBalance, isLoading: loadingBalance } = useReadContract({
    address: contractAddress,
    abi: contractAbi,
    functionName: "balanceOf", // Assuming your contract has this ERC20 function
    args: [address],
  }) as { data: bigint | undefined; isLoading: boolean };

  // Process the dashboard items with real data
  const processedDashboardItems: DashboardItem[] = [
    {
      title: "My Statistics",
      icon: <BarChart3 className="w-6 h-6 text-[#0A1A1F]" />,
      span: "col-span-6 md:col-span-4",
      height: "h-[300px]",
      content: (
        <div className="flex-grow grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <p className="text-white/70">Total Investments</p>
            <p className="text-3xl font-bold text-[#D0FD3E]">
              $
              {loadingInvestments
                ? "Loading..."
                : (
                    Number(formatEther(dashboardStats?.[2] ?? 0n)) *
                      avaxUsdPrice || 0
                  ).toLocaleString()}
            </p>
          </div>
          <div className="space-y-2">
            <p className="text-white/70">Total Listings</p>
            <p className="text-3xl font-bold text-[#D0FD3E]">
              {loadingStats
                ? "Loading..."
                : (dashboardStats?.[1] ?? 0n).toString()}
            </p>
          </div>
          <div className="space-y-2">
            <p className="text-white/70">Total AVAX Spent</p>
            <p className="text-3xl font-bold text-[#D0FD3E]">
              {loadingStats
                ? "Loading..."
                : `${formatEther(dashboardStats?.[2] ?? 0n)} AVAX`}
            </p>
          </div>
          <div className="space-y-2">
            <p className="text-white/70">AVAX Price</p>
            <p className="text-3xl font-bold text-[#D0FD3E]">
              ${avaxUsdPrice.toFixed(2)}
            </p>
          </div>
        </div>
      ),
    },
    {
      title: "Current Balance",
      icon: <Wallet className="w-6 h-6 text-[#0A1A1F]" />,
      span: "col-span-6 md:col-span-2",
      height: "h-[300px]",
      content: (
        <div className="flex flex-col justify-between h-full">
          <div>
            <p className="text-4xl font-bold text-[#D0FD3E] mb-2">
              {loadingBalance ? "Loading..." : formatEther(propBalance ?? 0n)}
            </p>
            <p className="text-white/70">PROP Tokens</p>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-white/70">Value in USD</span>
            <span className="text-xl font-semibold text-white">
              $
              {loadingBalance
                ? "Loading..."
                : (
                    Number(formatEther(propBalance ?? 0n)) * avaxUsdPrice
                  ).toLocaleString()}
            </span>
          </div>
        </div>
      ),
    },
    {
      title: "My Investments",
      icon: <Building2 className="w-6 h-6 text-[#0A1A1F]" />,
      span: "col-span-6 md:col-span-3",
      height: "h-[400px]",
      content: (
        <div className="flex flex-col h-full">
          <ScrollArea className="flex-grow pr-4">
            <ul className="space-y-4">
              {loadingInvestments ? (
                <li className="text-white">Loading investments...</li>
              ) : (
                investments?.map((investment, index) => (
                  <li key={index} className="bg-white/5 p-3 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="text-white">
                        {investmentProperties?.[index]?.name ?? "Loading..."}
                      </span>
                      <span className="text-[#9EF01A] font-semibold">
                        {formatEther(investment.investmentAmount)} AVAX
                      </span>
                    </div>
                    <div className="text-sm text-white/70 mt-1">
                      Return Rate:{" "}
                      {investment.actualRate > 0n
                        ? `${Number(investment.actualRate) / 100}%`
                        : `${
                            Number(investment.proposedRate) / 100
                          }% (Proposed)`}
                    </div>
                  </li>
                ))
              )}
            </ul>
          </ScrollArea>
        </div>
      ),
    },
    {
      title: "My Listings",
      icon: <ListChecks className="w-6 h-6 text-[#0A1A1F]" />,
      span: "col-span-6 md:col-span-3",
      height: "h-[400px]",
      content: (
        <div className="flex flex-col h-full">
          <ScrollArea className="flex-grow pr-4">
            <ul className="space-y-4">
              {loadingListings ? (
                <li className="text-white">Loading listings...</li>
              ) : (
                listings?.map((listing, index) => (
                  <li
                    key={index}
                    className="flex justify-between items-center bg-white/5 p-3 rounded-lg"
                  >
                    <span className="text-white">{properties[index].name}</span>
                    <span className="text-[#9EF01A] font-semibold">
                      {formatEther(listing.tokenPrice)} AVAX/token
                    </span>
                  </li>
                ))
              )}
            </ul>
          </ScrollArea>
        </div>
      ),
    },
  ];

  return (
    <div className="pt-[15vh] min-h-screen bg-[#0A1A1F] relative overflow-hidden p-6">
      {/* Gradient Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -right-40 w-96 h-96 bg-[#D0FD3E]/20 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8">
          Investor Dashboard
        </h1>

        <div className="grid grid-cols-6 gap-6">
          {processedDashboardItems.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={item.span}
            >
              <Card
                className={`bg-white/5 border-white/10 p-8 ${item.height} relative overflow-hidden group hover:bg-white/10 transition-colors`}
              >
                <div className="relative z-10 h-full flex flex-col">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-lg bg-[#9EF01A] flex items-center justify-center">
                      {item.icon}
                    </div>
                    <h2 className="text-2xl font-semibold text-white">
                      {item.title}
                    </h2>
                  </div>
                  {item.content}
                </div>
                <div className="absolute inset-0 border-2 border-transparent group-hover:border-[#D0FD3E]/30 rounded-lg transition-colors duration-300" />
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
