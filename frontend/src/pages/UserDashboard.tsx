"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Building2, BarChart3, ListChecks, Wallet } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { contractAddress, contractAbi } from "@/abi";
import { useAccount, useReadContract, useWriteContract } from "wagmi";
import { formatEther } from "viem";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

type DashboardStats = readonly [bigint, bigint];

interface ListingInfo {
  propertyId: bigint;
  tokenPrice: bigint;
  resalePrice: bigint;
  forSale: boolean;
  totalValue: bigint;
  totalInvestedTokens: bigint;
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
  const [ETHUsdPrice, setETHUsdPrice] = useState<number>(0);
  const [properties, setProperties] = useState<Property[]>([]);
  const [investmentProperties, setInvestmentProperties] = useState<Property[]>(
    []
  );
  const [_stats, setStats] = useState<DashboardStats | undefined>(undefined);
  const [_isLoadingProperties, setIsLoadingProperties] = useState(true);
  const [totalInvestedETH, setTotalInvestedETH] = useState<bigint>(0n);

  const { data: dashboardStats, refetch: refetchMyStats } = useReadContract({
    address: contractAddress,
    abi: contractAbi,
    functionName: "getDashboardStats",
    args: [address || "0x0000000000000000000000000000000000000000"],
  }) as {
    data: DashboardStats | undefined;
    refetch: () => Promise<any>;
  };

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

  useEffect(() => {
    console.log("listings: ", listings);
  }, [investments, listings]);

  useEffect(() => {
    if (investments && investments.length > 0) {
      const total = investments.reduce(
        (sum, investment) => sum + investment.investmentAmount,
        0n
      );
      console.log("Total invested ETH calculated:", formatEther(total));
      setTotalInvestedETH(total);
    } else {
      setTotalInvestedETH(0n);
    }
  }, [investments]);

  useEffect(() => {
    if (!address) return;

    console.log("Setting up refetch interval");
    const intervalId = setInterval(() => {
      refetchMyStats()
        .then((result) => {
          console.log("Refetching stats successful: ", result);
          setStats(result.data);
        })
        .catch((error) => {
          console.error("Error during refetch: ", error);
        });
    }, 5000);

    return () => {
      console.log("Cleaning up refetch interval");
      clearInterval(intervalId);
    };
  }, [refetchMyStats, address]);

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
    if (!ids.length) return [];

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
      console.log("Filtered properties by IDs:", filteredData);
      return filteredData as Property[];
    } catch (error) {
      console.error("Error fetching properties by IDs:", error);
      return [];
    }
  }

  useEffect(() => {
    if (dashboardStats && address) {
      console.log("Dashboard stats", dashboardStats);
      setETHUsdPrice(Number(dashboardStats[0]) / 100);
      getListingsFromBackend(address).then(setProperties);
    }
  }, [dashboardStats, address]);

  useEffect(() => {
    if (investments && investments.length > 0) {
      console.log("Investments", investments);
      const propertyIds = investments.map(
        (investment) => Number(investment.propertyId) + 1
      );
      console.log("Property IDs to fetch:", propertyIds);
      getPropertiesByIds(propertyIds).then((props) => {
        console.log("Fetched investment properties:", props);
        setInvestmentProperties(props);
      });
    }
  }, [investments]);

  const { writeContractAsync } = useWriteContract();

  async function handleWithdraw(id: number) {
    if (!id) return;

    console.log("Withdrawing from property:", id);
    try {
      const tx = await writeContractAsync(
        {
          address: contractAddress,
          abi: contractAbi,
          functionName: "burnTokensFromProperty",
          args: [id - 1],
        },
        {
          onSuccess(data) {
            console.log("Burn successful!", data);
          },
          onSettled(data, error) {
            if (error) {
              console.error("Error on settlement:", error);
            } else {
              console.log("Transaction settled:", data);
            }
          },
        }
      );
      if (tx) {
        console.log("Transaction hash:", tx);
      }
    } catch (error) {
      console.error("Error submitting transaction:", error);
    }
  }

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
              {investments ? investments.length.toString() : "0"}
            </p>
          </div>
          <div className="space-y-2">
            <p className="text-white/70">Total Listings</p>
            <p className="text-3xl font-bold text-[#D0FD3E]">
              {listings ? listings?.length.toString() : "0"}
            </p>
          </div>
          <div className="space-y-2">
            <p className="text-white/70">Total ETH Spent</p>
            <div className="flex items-center gap-2">
              <p className="text-3xl font-bold text-[#D0FD3E]">
                {totalInvestedETH > 0 ? formatEther(totalInvestedETH) : "0.00"}
              </p>
              <span className="text-3xl font-bold text-[#D0FD3E]">ETH</span>
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-white/70">ETH Price</p>
            <p className="text-3xl font-bold text-[#D0FD3E]">
              ${ETHUsdPrice ? ETHUsdPrice.toFixed(2) : "0.00"}
            </p>
          </div>
        </div>
      ),
    },
    {
      title: "Current PROP Balance",
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
              ) : investments && investments.length > 0 ? (
                investments.map((investment, index) => {
                  // Find the matching property by ID
                  const propertyId = Number(investment.propertyId) + 1;
                  const investmentProperty = investmentProperties.find(
                    (prop) => prop.id === propertyId
                  );
                  console.log("Investment Property", investmentProperty);

                  return (
                    <li
                      key={`${investment.propertyId}-${index}`}
                      className="bg-white/5 p-3 rounded-lg"
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-white">
                          {`${investmentProperty?.name}`}
                        </span>
                        <span className="text-[#9EF01A] font-semibold">
                          {formatEther(investment.investmentAmount)} ETH
                        </span>

                        <Button
                          onClick={() => handleWithdraw(propertyId)}
                          disabled={!investment.actualRate}
                        >
                          {investment.actualRate > 0n
                            ? "Withdraw"
                            : "Not sold yet"}
                        </Button>
                      </div>
                      <div className="text-sm text-white/70 mt-1">
                        Return Rate:{" "}
                        {investment.actualRate > 0n
                          ? `${Number(investment.actualRate)}% (Finalized)`
                          : `${Number(investment.proposedRate)}% (Proposed)`}
                      </div>
                    </li>
                  );
                })
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
              {loadingListings ? (
                <li className="text-white">Loading listings...</li>
              ) : listings && listings.length > 0 ? (
                listings.map((listing) => (
                  <li
                    key={`listing-${listing.propertyId}`}
                    className="flex justify-between items-center bg-white/5 p-3 rounded-lg"
                  >
                    <span className="text-white">
                      {properties?.find(
                        (p) => p.id === Number(listing.propertyId) + 1
                      )?.name || `Property #${Number(listing.propertyId) + 1}`}
                    </span>
                    <div className="flex gap-2 items-center">
                      <pre className="text-white">Listing Price</pre>
                      <div className="text-[#9EF01A] font-semibold">
                        {(Number(listing.totalValue) / 10 ** 18).toString()} ETH
                      </div>
                      <div>
                        {Number(listing.totalValue) ===
                          Number(listing.totalInvestedTokens) / 1000 &&
                          !listing.forSale && (
                            <div className="text-[#9EF01A] font-semibold flex items-center">
                              | <pre className="text-white"> Sold at </pre>
                              {(
                                Number(listing?.resalePrice) /
                                10 ** 18
                              ).toString()}{" "}
                              ETH
                            </div>
                          )}
                      </div>
                      <div>
                        {Number(listing.totalValue) !==
                          Number(listing.totalInvestedTokens) / 1000 && (
                          <div className="text-[#9EF01A] font-semibold flex items-center">
                            |{" "}
                            <pre className="text-white"> Total Invested: </pre>
                            {(
                              Number(listing?.totalInvestedTokens) /
                              10 /
                              Number(listing.totalValue)
                            ).toString()}
                            %
                          </div>
                        )}
                      </div>
                      {/* <img className="h-8 w-8" src="/ETH_lime.svg" alt="" /> */}
                    </div>
                  </li>
                ))
              ) : (
                <li className="text-white/70">No listings found</li>
              )}
            </ul>
          </ScrollArea>
        </div>
      ),
    },
  ];

  return address ? (
    <div className="pt-[15vh] min-h-screen bg-[#0A1A1F] relative overflow-hidden p-6">
      {/* Gradient Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -right-40 w-96 h-96 bg-[#D0FD3E]/20 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        <motion.h1
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6 md:mb-12 text-center mt-20 md:mt-6 px-4"
        >
          <span className="bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent mt-10">
            Your
          </span>{" "}
          <span className="bg-gradient-to-r from-[#D0FD3E] to-[#9EF01A] bg-clip-text text-transparent">
            Dashboard
          </span>
        </motion.h1>
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
  ) : (
    <div className="flex items-center justify-center min-h-screen bg-[#0A1A1F]">
      <h1 className="text-4xl font-bold text-white">
        Please connect your wallet to view the dashboard.
      </h1>
    </div>
  );
}
