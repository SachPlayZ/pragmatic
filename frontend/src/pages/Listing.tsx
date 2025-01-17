import { motion } from "framer-motion";
import ListCard from "@/components/ListCard";
import ListForm from "@/components/ListForm";
import { useEffect, useState } from "react";
import { GetAllProperties } from "@/components/functions/GetAllProperties";

interface PropertyFromContract {
  owner: string;
  totalValue: string;
  totalTokens: string;
  isListed: boolean;
  rentalIncome: string;
  resalePrice: string;
  forSale: boolean;
  finalReturnRate: string;
  totalInvestedTokens: string;
  returnRateFinalized: boolean;
}

interface PropertyDetailsFromBackend {
  id: number;
  owner: string;
  name: string;
  location: string;
  price: string;
  bedrooms: number;
  sqft: number;
  listDate: string;
  imageUrl: string;
}

interface Property {
  id: number;
  imageUrl: string;
  name: string;
  location: string;
  price: string;
  bedrooms: number;
  sqft: number;
  tokenPrice: string;
  availableTokens: string;
}

export default function Listing() {
  // State for backend properties
  const [properties, setProperties] = useState<PropertyDetailsFromBackend[]>(
    []
  );
  // New state for combined property data
  const [combinedProperties, setCombinedProperties] = useState<Property[]>([]);

  const { data: propertyList, refetch } = GetAllProperties();

  useEffect(() => {
    // Fetch properties from backend
    const fetchProperties = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_PUBLIC_BACKEND_URL}/property`
        );
        const data = await response.json();
        setProperties(data);
      } catch (error) {
        console.error("Error fetching properties:", error);
      }
    };

    fetchProperties();
    refetch();
  }, []); // Fetch on component mount

  useEffect(() => {
    console.log("Setting up refetch interval");

    const interval = setInterval(() => {
      refetch()
        .then((result: any) => {
          console.log("Refetch successful: ", result);
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

  useEffect(() => {
    // Combine backend and contract data when both are available
    if (propertyList && properties.length > 0) {
      const combined = properties
        .map((property, index) => {
          const propertyFromContract = (propertyList as PropertyFromContract[])[
            index
          ];

          if (!propertyFromContract) {
            console.warn(`No contract data found for property index ${index}`);
            return null;
          }

          return {
            id: property.id,
            imageUrl: property.imageUrl,
            name: property.name,
            location: property.location,
            price: property.price,
            bedrooms: property.bedrooms,
            sqft: property.sqft,
            tokenPrice: propertyFromContract.totalTokens,
            availableTokens: (
              BigInt(propertyFromContract.totalTokens) -
              BigInt(propertyFromContract.totalInvestedTokens)
            ).toString(),
          };
        })
        .filter((property): property is Property => property !== null);

      setCombinedProperties(combined);
    }
  }, [properties, propertyList]); // Update when either data source changes

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
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
              <span className="bg-gradient-to-r from-[#D0FD3E] to-[#9EF01A] bg-clip-text text-transparent">
                Property Listing
              </span>
            </h1>
            <p className="mt-2 text-lg text-gray-400">
              Overview and find a comfortable real estate for your life
            </p>
          </motion.div>

          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
            <ListForm />
          </motion.div>

          <div className="grid lg:w-[75%] gap-6 lg:px-6 md:grid-cols-2 lg:grid-cols-2">
            {combinedProperties.map((property) => (
              <ListCard property={property} key={property.id} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
