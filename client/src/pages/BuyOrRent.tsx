"use client";

import { motion } from "framer-motion";
import PropertyCard from "@/components/ProductCard";

const properties = [
  {
    id: 1,
    name: "Luxury Skyline Apartment",
    image: "/1.jpeg",
    type: "2BHK",
    area: 1200,
    rentPrice: 0.5,
    salePrice: 150,
  },
  {
    id: 2,
    name: "Serene Suburban Villa",
    image: "/2.jpg",
    type: "3BHK",
    area: 2000,
    rentPrice: 0.8,
    salePrice: 250,
  },
  {
    id: 3,
    name: "Downtown Loft",
    image: "/3.jpg",
    type: "1BHK",
    area: 800,
    rentPrice: 0.3,
    salePrice: 100,
  },
  {
    id: 4,
    name: "Beachfront Condo",
    image: "/4.jpeg",
    type: "2BHK",
    area: 1500,
    rentPrice: 0.7,
    salePrice: 200,
  },
];

export default function Properties() {
  return (
    <div className="min-h-screen bg-[#0A1A1F] relative overflow-hidden">
      {/* Gradient Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -right-40 w-96 h-96 bg-[#D0FD3E]/20 rounded-full blur-3xl" />
      </div>

      <main className="pt-10">
        <section className="container mx-auto px-4 py-20 md:py-32 max-w-6xl">
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
            {properties.map((property, index) => (
              <motion.div
                key={property.id}
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <PropertyCard property={property} />
              </motion.div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
