"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Bookmark, Building2, PlusIcon } from "lucide-react";
import { motion } from "framer-motion";

interface Property {
  id: string;
  name: string;
  location: string;
  price: number;
  tokenPrice: number;
  totalTokens: number;
  availableTokens: number;
  imageUrl: string;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
}

const properties: Property[] = [
  {
    id: "1",
    name: "Collezione House",
    location: "Warsaw, Poland",
    price: 785000,
    tokenPrice: 500,
    totalTokens: 1570,
    availableTokens: 985,
    imageUrl: "/1.jpeg",
    bedrooms: 4,
    bathrooms: 3,
    sqft: 1250,
  },
  {
    id: "2",
    name: "Kayappa House",
    location: "Warsaw, Poland",
    price: 837000,
    tokenPrice: 1000,
    totalTokens: 837,
    availableTokens: 0,
    imageUrl: "/2.jpg",
    bedrooms: 4,
    bathrooms: 3,
    sqft: 1120,
  },
  {
    id: "3",
    name: "Willisme House",
    location: "Warsaw, Poland",
    price: 723000,
    tokenPrice: 750,
    totalTokens: 964,
    availableTokens: 500,
    imageUrl: "/4.jpeg",
    bedrooms: 3,
    bathrooms: 2,
    sqft: 1230,
  },
];

export default function Listing() {
  return (
    <div className="min-h-screen bg-[#0A1A1F]">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -right-40 w-96 h-96 bg-[#D0FD3E]/20 rounded-full blur-3xl" />
      </div>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6 mt-24 flex items-center justify-between px-8">
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex-1"
          >
            {/* Title */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
              <span className="bg-gradient-to-r from-[#D0FD3E] to-[#9EF01A] bg-clip-text text-transparent">
                Property Listing
              </span>
            </h1>
            {/* Subtitle */}
            <p className="mt-2 text-lg text-gray-400">
              Overview and find a comfortable real estate for your life
            </p>
          </motion.div>

          {/* Button */}
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="outline"
              className="gap-2 bg-lime-400 text-black hover:bg-lime-500"
            >
              <PlusIcon className="h-4 w-4" />
              Add your property
            </Button>
          </motion.div>
        </div>

        <div className="grid gap-6 px-6 md:grid-cols-2 lg:grid-cols-3">
          {properties.map((property) => (
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
                <div className="aspect-[16/9] w-full overflow-hidden">
                  <img
                    src={property.imageUrl}
                    alt={property.name}
                    className="h-full w-full object-cover"
                  />
                </div>

                {/* Content */}
                <CardContent className="p-4">
                  {/* Title and Price */}
                  <div className="mb-4 flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold">{property.name}</h3>
                      <p className="text-sm text-gray-400">
                        {property.location}
                      </p>
                    </div>
                    <span className="text-lg font-bold text-lime-400">
                      ${property.price.toLocaleString()}
                    </span>
                  </div>

                  {/* Details */}
                  <div className="mb-4 flex items-center gap-3 text-sm text-gray-400">
                    <span>{property.bedrooms} BHK</span>
                    <span>•</span>
                    <span>{property.sqft} sqft</span>
                  </div>

                  {/* Token Info */}
                  <div className="grid grid-cols-2 gap-2 text-sm text-gray-400">
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
                    <div className="justify-self-end">
                      <span>Available:</span>
                      <span className="ml-1 font-medium text-lime-400">
                        {property.availableTokens} tokens
                      </span>
                    </div>
                  </div>
                </CardContent>

                {/* Footer */}
                <CardFooter className="flex items-center gap-2 p-4 pt-1">
                  <Button
                    className="flex-1 bg-lime-400 text-black hover:bg-lime-500  text-sm"
                    disabled={property.availableTokens === 0}
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
          ))}
        </div>
      </div>
    </div>
  );
}
