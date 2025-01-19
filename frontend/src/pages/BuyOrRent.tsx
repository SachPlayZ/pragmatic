"use client";

import { motion } from "framer-motion";
import PropertyCard from "@/components/ProductCard";
import GetPropOnSale from "@/components/functions/GetPropOnSale";
import { useEffect, useState } from "react";

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

interface PropertyOnSale {
  owner: string;
  totalValue: string;
  resalePrice: string;
  finalReturnRate: string;
  id: number;
}

export default function Properties() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [propertyIdsOnSale, setPropertyIdsOnSale] = useState<number[]>([]);

  async function getProperties() {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/property`);
    const data = await res.json();
    return data as Property[];
  }

  const { refetch } = GetPropOnSale();

  useEffect(() => {
    getProperties()
      .then((data) => {
        setProperties(data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching properties:", error);
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    console.log("Setting up refetch interval");

    const interval = setInterval(() => {
      refetch()
        .then((result: any) => {
          console.log("Refetch successful: ", result);
          if (result.data) {
            const idsOnSale = result.data.map(
              (property: PropertyOnSale) => property.id
            );
            setPropertyIdsOnSale(idsOnSale);
          }
        })
        .catch((error: any) => {
          console.error("Error during refetch: ", error);
        });
    }, 5000);

    return () => {
      console.log("Clearing refetch interval");
      clearInterval(interval);
    };
  }, [refetch]);

  // Filter the properties based on the propertyIdsOnSale
  const filteredProperties = properties.filter((property) =>
    propertyIdsOnSale.includes(property.id)
  );

  return (
    <div className="min-h-screen bg-[#0A1A1F] relative overflow-hidden">
      {/* Gradient Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -right-40 w-96 h-96 bg-[#D0FD3E]/20 rounded-full blur-3xl" />
      </div>

      <main>
        <section className="container mx-auto px-4 py-10 md:py-28 max-w-6xl">
          <motion.h1
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-12 text-center"
          >
            <span className="bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
              Explore Premium
            </span>{" "}
            <span className="bg-gradient-to-r from-[#D0FD3E] to-[#9EF01A] bg-clip-text text-transparent">
              Properties
            </span>
          </motion.h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {isLoading ? (
              <div className="text-white text-center w-full">Loading...</div>
            ) : filteredProperties.length ? (
              filteredProperties.map((property, index) => (
                <motion.div
                  key={property.id}
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <PropertyCard property={property} />
                </motion.div>
              ))
            ) : (
              <div className="text-white text-center w-full">
                No properties available
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
