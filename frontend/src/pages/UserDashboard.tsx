"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Building2, BarChart3, ListChecks, Wallet } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { contractAddress, contractAbi } from "@/abi";
import { useAccount, useReadContract } from "wagmi";
import { formatEther } from "viem";
import { useState, useEffect } from "react";
// import { Button } from "@/components/ui/button";

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
  const [isLoadingProperties, setIsLoadingProperties] = useState(true);

  // Fetch dashboard stats with proper typing
  const { data: dashboardStats, isLoading: loadingStats } = useReadContract({
    address: contractAddress,
    abi: contractAbi,
    functionName: "getDashboardStats",
    args: [address],
  }) as { data: DashboardStats | undefined; isLoading: boolean };

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

  // Fetch balance
  const { data: propBalance, isLoading: loadingBalance } = useReadContract({
    address: contractAddress,
    abi: contractAbi,
    functionName: "balanceOf",
    args: [address],
  }) as { data: bigint | undefined; isLoading: boolean };

  async function getListingsFromBackend(address: string) {
    try {
      setIsLoadingProperties(true);
      const response = await fetch(
        `${import.meta.env.VITE_PUBLIC_BACKEND_URL}/property`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch properties");
      }
      const data = await response.json();
      const filteredData = data.filter(
        (prop: Property) => prop.owner === address
      );
      console.log("Filtered data", filteredData);
      return filteredData as Property[];
    } catch (error) {
      console.error("Error fetching properties:", error);
      return [];
    } finally {
      setIsLoadingProperties(false);
    }
  }

  async function getPropertiesByIds(ids: number[]) {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_PUBLIC_BACKEND_URL}/property`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch properties by IDs");
      }
      const data = await response.json();
      const filteredData = data.filter((prop: Property) =>
        ids.includes(prop.id)
      );
      console.log("Filtered data", filteredData);
      return filteredData as Property[];
    } catch (error) {
      console.error("Error fetching properties by IDs:", error);
      return [];
    }
  }

  useEffect(() => {
    if (dashboardStats) {
      console.log("Dashboard stats", dashboardStats);
      setAvaxUsdPrice(Number(dashboardStats[0]) / 1e8);
      if (address) {
        getListingsFromBackend(address).then(setProperties);
        console.log("Properties", properties);
      }
    }
  }, [dashboardStats, address]);

  useEffect(() => {
    if (investments) {
      console.log("Investments", investments);
      const propertyIds = investments.map(
        (investment) => Number(investment.propertyId) + 1
      );
      getPropertiesByIds(propertyIds).then(setInvestmentProperties);
      console.log("Investment properties", investmentProperties);
    }
  }, [investments]);

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
            <div className="flex gap-2">
              <p className="text-3xl font-bold text-[#D0FD3E]">
                {loadingStats
                  ? "Loading..."
                  : `${formatEther(dashboardStats?.[2] ?? 0n)}`}
              </p>
              <img className="h-8 w-8" src="/avax_lime.svg" alt="" />
            </div>
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
              ) : investments?.length ? (
                investments.map((investment, index) => (
                  <li
                    key={`${investment.propertyId}-${index}`}
                    className="bg-white/5 p-3 rounded-lg"
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-white">
                        {investmentProperties[index]?.name ??
                          `Property #${investment.propertyId}`}
                      </span>
                      <span className="text-[#9EF01A] font-semibold">
                        {formatEther(investment.investmentAmount)} AVAX
                      </span>
                      {/* <Button>
                        investment.investmentAmount ===  > 0n
                          ? "Withdraw"
                          : "Withdraw (Proposed)"
                      </Button> */}
                    </div>
                    <div className="text-sm text-white/70 mt-1">
                      Return Rate:{" "}
                      {investment.actualRate > 0n
                        ? `${Number(investment.actualRate)}%`
                        : `${Number(investment.proposedRate)}% (Proposed)`}
                    </div>
                  </li>
                ))
              ) : (
                <li className="text-white/70">No investments found</li>
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
              {loadingListings || isLoadingProperties ? (
                <li className="text-white">Loading listings...</li>
              ) : listings && listings.length > 0 ? (
                listings.map((listing, index) => {
                  const property = properties[index];
                  return (
                    <li
                      key={`${listing.propertyId}-${index}`}
                      className="flex justify-between items-center bg-white/5 p-3 rounded-lg"
                    >
                      <span className="text-white">
                        {property?.name || `Property #${listing.propertyId}`}
                      </span>
                      <span className="text-[#9EF01A] font-semibold">
                        {property.price.toString()} AVAX
                      </span>
                    </li>
                  );
                })
              ) : (
                <li className="text-white/70">No listings found</li>
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
