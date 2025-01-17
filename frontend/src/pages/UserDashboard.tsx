"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Building2, BarChart3, ListChecks, Wallet } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function Dashboard() {
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
          {dashboardItems.map((item, index) => (
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
                {/* Content */}
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

                  {/* Decorative elements */}
                  <div className="absolute bottom-6 right-6">
                    <motion.div
                      className="w-20 h-20 rounded-full bg-gradient-to-br from-[#D0FD3E]/20 to-[#FF7E5F]/20"
                      animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 0.5, 0.3],
                      }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    />
                  </div>
                </div>

                {/* Hover effect */}
                <div className="absolute inset-0 border-2 border-transparent group-hover:border-[#D0FD3E]/30 rounded-lg transition-colors duration-300" />
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

const dashboardItems = [
  {
    title: "My Statistics",
    icon: <BarChart3 className="w-6 h-6 text-[#0A1A1F]" />,
    span: "col-span-6 md:col-span-4",
    height: "h-[300px]",
    content: (
      <div className="flex-grow grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <p className="text-white/70">Total Investments</p>
          <p className="text-3xl font-bold text-[#D0FD3E]">$2,450,000</p>
        </div>
        <div className="space-y-2">
          <p className="text-white/70">Total Listings</p>
          <p className="text-3xl font-bold text-[#D0FD3E]">15</p>
        </div>
        <div className="space-y-2">
          <p className="text-white/70">Total AVAX Spent</p>
          <p className="text-3xl font-bold text-[#D0FD3E]">5,230 AVAX</p>
        </div>
        <div className="space-y-2">
          <p className="text-white/70">ROI</p>
          <p className="text-3xl font-bold text-[#D0FD3E]">+12.5%</p>
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
          <p className="text-4xl font-bold text-[#D0FD3E] mb-2">15,750</p>
          <p className="text-white/70">PROP Tokens</p>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-white/70">Value in USD</span>
          <span className="text-xl font-semibold text-white">$31,500</span>
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
            {[
              { name: "Downtown Condo", value: "$450,000", return: "7.2%" },
              { name: "Suburban House", value: "$380,000", return: "5.8%" },
              { name: "Beach Resort", value: "$750,000", return: "9.5%" },
              { name: "City Center Office", value: "$620,000", return: "8.1%" },
              {
                name: "Industrial Warehouse",
                value: "$520,000",
                return: "6.7%",
              },
              { name: "Mountain Chalet", value: "$410,000", return: "7.9%" },
              { name: "Retail Space", value: "$290,000", return: "6.3%" },
              { name: "Student Housing", value: "$340,000", return: "8.6%" },
            ].map((investment, index) => (
              <li key={index} className="bg-white/5 p-3 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-white">{investment.name}</span>
                  <span className="text-[#9EF01A] font-semibold">
                    {investment.value}
                  </span>
                </div>
                <div className="text-sm text-white/70 mt-1">
                  Annual Return: {investment.return}
                </div>
              </li>
            ))}
          </ul>
        </ScrollArea>
        <div className="text-white/70 text-sm mt-4">
          Last updated: 2 hours ago
        </div>
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
            {[
              "Luxury Condo - Downtown",
              "Office Space - Tech Park",
              "Retail Shop - Main Street",
              "Apartment Complex - Riverside",
              "Warehouse - Industrial Zone",
              "Beach House - Coastal Area",
              "Ski Chalet - Mountain Resort",
              "Farm Land - Rural County",
              "Hotel - Tourist District",
              "Parking Garage - City Center",
            ].map((listing, index) => (
              <li
                key={index}
                className="flex justify-between items-center bg-white/5 p-3 rounded-lg"
              >
                <span className="text-white">{listing}</span>
                <span className="text-[#9EF01A] font-semibold">Active</span>
              </li>
            ))}
          </ul>
        </ScrollArea>
        <button className="text-[#D0FD3E] hover:underline mt-4">
          View All Listings
        </button>
      </div>
    ),
  },
];
