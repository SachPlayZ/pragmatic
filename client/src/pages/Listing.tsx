import { motion } from "framer-motion";
import ListCard from "@/components/ListCard";
import { Property } from "@/interfaces/interface";
import ListForm from "@/components/ListForm";

const properties: Property[] = [
  {
    name: "Collezione House",
    location: "Warsaw, Poland",
    price: 785000,
    totalTokens: 1570,
    availableTokens: 985,
    imageUrl: "/1.jpeg",
    bedrooms: 4,
    sqft: 1250,
  },
  {
    name: "Kayappa House",
    location: "Warsaw, Poland",
    price: 837000,
    totalTokens: 837,
    availableTokens: 0,
    imageUrl: "/2.jpg",
    bedrooms: 4,
    sqft: 1120,
  },
  {
    name: "Willisme House",
    location: "Warsaw, Poland",
    price: 723000,
    totalTokens: 964,
    availableTokens: 500,
    imageUrl: "/4.jpeg",
    bedrooms: 3,
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

      <main className="container mx-auto px-4 py-8">
        <section className="mb-6 mt-24 flex flex-col gap-5 gap-y-8 items-center justify-between lg:px-8">
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
            <ListForm />
          </motion.div>

          <div className="grid lg:w-[75%] gap-6 lg:px-6 md:grid-cols-2 lg:grid-cols-2">
            {properties.map((property, index) => (
              <ListCard property={property} key={index} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
