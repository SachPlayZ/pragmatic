import { motion } from "framer-motion";
import ListCard from "@/components/ListCard";
import ListForm from "@/components/ListForm";
import { useEffect, useState } from "react";
import { GetAllProperties } from "@/components/functions/GetAllProperties";
import CoolOverlayModal from "@/components/CoolOverlayModal";
import { GitCompareArrows } from "lucide-react";

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
  ammenities: string;
}

interface PropsForCompare {
  id: number;
  owner: string;
  imageUrl: string;
  name: string;
  location: string;
  price: string;
  bedrooms: number;
  sqft: number;
  ammenities: string;
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
  address: string;
  ammenities: string;
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
  address: string;
  ammenities: string;
}

interface ComparisonObject {
  "Best Property": number;
  "Worst Property": number;
  Comparison: Array<{
    id: number;
    Pros: string[];
    Cons: string[];
    "Unique Features": string[];
    "Professional Opinion": string;
    "Overall Rating": number;
  }>;
}

export default function Listing() {
  const [properties, setProperties] = useState<PropertyDetailsFromBackend[]>(
    []
  );
  const [props, setProps] = useState<PropsForCompare[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [combinedProperties, setCombinedProperties] = useState<Property[]>([]);
  const [comparisonData, setComparisonData] = useState<ComparisonObject | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true); // Added loading state

  const { data: propertyList, refetch } = GetAllProperties();

  const fetchComparisonData = async (
    propertiesToCompare: PropsForCompare[]
  ) => {
    const propertiesToCompareStringified = propertiesToCompare.map(
      (property) => ({
        ...property,
        id: property.id.toString(),
        price: property.price.toString(),
        bedrooms: property.bedrooms.toString(),
        sqft: property.sqft.toString(),
      })
    );
    try {
      const response = await fetch(
        `${import.meta.env.VITE_PUBLIC_BACKEND_URL}/getComparison`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ properties: propertiesToCompareStringified }),
        }
      );
      const data = await response.json();
      setComparisonData(data);
    } catch (error) {
      console.error("Error fetching comparison data:", error);
    }
  };

  const addToComparison = async (property: PropsForCompare) => {
    console.log("Adding to comparison: ");
    console.log(property);
    const proper: PropsForCompare = {
      id: property.id,
      owner: property.owner,
      imageUrl: property.imageUrl,
      name: property.name,
      location: property.location,
      price: `${(Number(property.price) / 10 ** 18).toString()} AVAX`,
      bedrooms: property.bedrooms,
      sqft: property.sqft,
      ammenities: property.ammenities,
    };
    if (!props.some((p) => p.id === property.id)) {
      const updatedProps = [...props, proper];
      setProps(updatedProps);

      // Fetch comparison data if we have 2 or more properties
      if (updatedProps.length >= 2) {
        await fetchComparisonData(updatedProps);
      }
    }
  };

  useEffect(() => {
    const fetchProperties = async () => {
      setIsLoading(true); // Set loading to true before fetching
      try {
        const response = await fetch(
          `${import.meta.env.VITE_PUBLIC_BACKEND_URL}/property`
        );
        const data = await response.json();
        setProperties(data);
      } catch (error) {
        console.error("Error fetching properties:", error);
      } finally {
        setIsLoading(false); // Set loading to false after fetching, regardless of success or failure
      }
    };

    fetchProperties();
    refetch();
  }, []);

  useEffect(() => {
    console.log("Setting up refetch interval");

    const interval = setInterval(() => {
      refetch().catch((error: any) => {
        console.error("Error during refetch: ", error);
      });
    }, 5000);
    return () => {
      console.log("Clearing refetch interval");
      clearInterval(interval);
    };
  }, [refetch]);

  useEffect(() => {
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
            tokenPrice: `${10 ** 18}`,
            availableTokens: (
              BigInt(propertyFromContract.totalTokens) -
              BigInt(propertyFromContract.totalInvestedTokens)
            ).toString(),
            address: property.address,
            ammenities: property.ammenities,
          };
        })
        .filter((property): property is Property => property !== null);

      setCombinedProperties(combined);
    }
  }, [properties, propertyList]);

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
              {/* {JSON.stringify(props)} */}
            </p>
          </motion.div>

          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
            <ListForm />
          </motion.div>

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-[#D0FD3E]"></div>
            </div>
          ) : (
            <div className="grid lg:w-[75%] gap-6 lg:px-6 md:grid-cols-2 lg:grid-cols-2">
              {combinedProperties.map((property) => (
                <ListCard
                  property={property}
                  key={property.id}
                  addToComparison={addToComparison}
                />
              ))}
            </div>
          )}
        </section>
      </main>
      <button
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-20 right-4 rounded-full p-4 shadow-lg transition-transform hover:scale-110 bg-gradient-to-r from-[#D0FD3E] to-[#9EF01A] text-[#0A1A1F]"
      >
        <GitCompareArrows className="h-6 w-6" />
      </button>
      {props.length > 1 && comparisonData && (
        <CoolOverlayModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          properties={props}
          comparisonObject={comparisonData}
        />
      )}
    </div>
  );
}
