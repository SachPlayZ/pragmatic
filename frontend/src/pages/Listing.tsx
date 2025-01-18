import { motion } from "framer-motion";
import ListCard from "@/components/ListCard";
import ListForm from "@/components/ListForm";
import { useEffect, useState } from "react";
import { GetAllProperties } from "@/components/functions/GetAllProperties";
import CoolOverlayModal from "@/components/CoolOverlayModal";
import { GitCompareArrows } from 'lucide-react';

const props = [
  {
    "id": 1,
    "owner": "248428",
    "name": "Crazy apartments",
    "location": "Manhattan",
    "price": "2",
    "bedrooms": 3,
    "sqft": 1491,
    "imageUrl": "https://picsum.photos/seed/apartment1/800/600",
    "ammenities": "Pool, Movie Theatre, Community Hall, Orgy Hall"
  },
  {
    "id": 2,
    "owner": "83929",
    "name": "Bro House",
    "location": "Beverly Hills",
    "price": "3",
    "bedrooms": 3,
    "sqft": 1832,
    "imageUrl": "https://picsum.photos/seed/apartment2/800/600",
    "ammenities": "Pool, Garden, Helipad"
  },
  {
    "id": 3,
    "owner": "123456",
    "name": "Eco Haven",
    "location": "Portland",
    "price": "1.5",
    "bedrooms": 2,
    "sqft": 1200,
    "imageUrl": "https://picsum.photos/seed/apartment3/800/600",
    "ammenities": "Solar Panels, Organic Garden, Bike Storage"
  },
  {
    "id": 4,
    "owner": "789012",
    "name": "Skyline Penthouse",
    "location": "Chicago",
    "price": "4",
    "bedrooms": 4,
    "sqft": 2500,
    "imageUrl": "https://picsum.photos/seed/apartment4/800/600",
    "ammenities": "Private Elevator, Rooftop Terrace, Smart Home System"
  }
]

const comparisonObject = {
  "Best Property": 4,
  "Worst Property": 1,
  "Comparison": [
    {
      "id": 1,
      "Pros": [
        "Affordable price",
        "Community-focused amenities",
        "Variety of social spaces"
      ],
      "Cons": [
        "Smaller square footage",
        "Less desirable location for some",
        "Questionable 'Orgy Hall' amenity"
      ],
      "Unique Features": [
        "Orgy Hall",
        "Movie Theatre",
        "Community Hall"
      ],
      "Professional Opinion": "While this property has some unique social spaces, its smaller size and questionable amenities may not appeal to all buyers. The location in Manhattan may also be a drawback for those who prefer a more suburban lifestyle.",
      "Overall Rating": 3
    },
    {
      "id": 2,
      "Pros": [
        "Larger square footage",
        "More desirable location in Beverly Hills",
        "Unique helipad amenity"
      ],
      "Cons": [
        "Higher price point",
        "Fewer community-focused amenities"
      ],
      "Unique Features": [
        "Helipad",
        "Garden"
      ],
      "Professional Opinion": "This property offers a more luxurious and spacious living experience, with a unique helipad amenity that will appeal to buyers who value convenience and exclusivity. The location in Beverly Hills is also highly desirable.",
      "Overall Rating": 4
    },
    {
      "id": 3,
      "Pros": [
        "Eco-friendly features",
        "Affordable price point",
        "Desirable location for nature lovers"
      ],
      "Cons": [
        "Smaller square footage",
        "Fewer bedrooms",
        "May not appeal to those seeking luxury amenities"
      ],
      "Unique Features": [
        "Solar Panels",
        "Organic Garden",
        "Bike Storage"
      ],
      "Professional Opinion": "This property is perfect for environmentally conscious buyers who prioritize sustainability. While it may be smaller, its eco-friendly features and location in Portland make it an attractive option for a specific market segment.",
      "Overall Rating": 4
    },
    {
      "id": 4,
      "Pros": [
        "Spectacular views",
        "Luxurious amenities",
        "Large square footage",
        "Prime location in Chicago"
      ],
      "Cons": [
        "Highest price point",
        "May be too large for some buyers",
        "High maintenance costs"
      ],
      "Unique Features": [
        "Private Elevator",
        "Rooftop Terrace",
        "Smart Home System"
      ],
      "Professional Opinion": "This penthouse offers the epitome of luxury living in Chicago. With its breathtaking views, high-end amenities, and smart home features, it's ideal for those seeking a premium urban lifestyle. However, the high price point and maintenance costs may limit its appeal to a select group of buyers.",
      "Overall Rating": 5
    }
  ]
}

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
  address: string;
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
}

export default function Listing() {
  // State for backend properties
  const [properties, setProperties] = useState<PropertyDetailsFromBackend[]>(
    []
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
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
            address: property.address
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
      <button
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-20 right-4 rounded-full p-4 shadow-lg transition-transform hover:scale-110 bg-gradient-to-r from-[#D0FD3E] to-[#9EF01A] text-[#0A1A1F]"
      >
        <GitCompareArrows className="h-6 w-6" />
      </button>
      <CoolOverlayModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        properties={props}
        comparisonObject={comparisonObject}
      />
    </div>
  );
}
