import { motion } from "framer-motion";
import { Building2, Home, Maximize2, Plus, Quote } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import InvestForm from "./InvestForm";
import { useState } from "react";

import { useEffect } from "react";

interface ListCardProps {
  property: any;
  addToComparison: (property: any) => void;
  forSale: boolean;
}

interface PropsForCompare {
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

interface QuoteInfo {
  pitch: string;
  rating: number;
  realtorName: string;
}

export default function ListCard({
  property,
  addToComparison,
  forSale,
}: ListCardProps) {
  const [showInvestButton, setShowInvestButton] = useState(true);
  const [quoteInfo, setQuoteInfo] = useState<QuoteInfo | null>(null);
  const [isQuoteLoading, setIsQuoteLoading] = useState(false);

  console.log("Property", property);

  const addCompare = (prop: any) => {
    const propy: PropsForCompare = {
      ...prop,
      location: prop.address,
    };
    addToComparison(propy);
  };

  const getQuote = async () => {
    setIsQuoteLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_PUBLIC_BACKEND_URL}/getDescription`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: property.name,
            location: property.address,
            price: (
              Number(property.price.toLocaleString()) /
              10 ** 18
            ).toString(),
            bedrooms: property.bedrooms,
            sqft: property.sqft,
            ammenities: property.ammenities,
          }),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch quote");
      }
      const data = await response.json();
      console.log("Data");
      console.log(data);
      setQuoteInfo({
        pitch: data.pitch,
        rating: data.rating,
        realtorName: 'Phil "AI" Dunphy', // Placeholder name as requested
      });
    } catch (error) {
      console.error("Error fetching quote:", error);
      setQuoteInfo({
        pitch: "We apologize, but we couldn't fetch a quote at this time.",
        rating: 0,
        realtorName: "N/A",
      });
    } finally {
      setIsQuoteLoading(false);
    }
  };

  const renderRatingStars = (rating: number) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <motion.svg
            key={star}
            className={`w-6 h-6 ${
              star <= rating ? "text-yellow-400" : "text-gray-400"
            }`}
            fill="currentColor"
            viewBox="0 0 20 20"
            initial={{ scale: 1 }}
            animate={{ scale: star <= rating ? [1, 1.2, 1] : 1 }}
            transition={{ duration: 0.3, delay: star * 0.1 }}
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </motion.svg>
        ))}
      </div>
    );
  };

  useEffect(() => {
    const interval = setInterval(() => {
      console.log(
        `Available tokens for ${property.name}: ${property.availableTokens}`
      );
    }, 1000);

    return () => clearInterval(interval);
  }, [property]);

  return (
    <motion.div
      key={property.id}
      className="rounded-xl overflow-hidden border border-gray-700 bg-gray-900 text-white"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      <Card className="rounded-xl border-none overflow-hidden bg-gray-900 text-white">
        {/* Image */}
        <div className="lg:aspect-[2] aspect-[16/9] w-full overflow-hidden">
          <img
            src={property.imageUrl || "/placeholder.svg"}
            alt={property.name}
            className="h-full w-full object-cover object-center"
          />
        </div>

        {/* Content */}
        <CardContent className="p-4">
          {/* Title and Price */}
          <div className="mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <div>
              <h3 className="text-lg font-semibold">{property.name}</h3>
              <p className="text-xs text-gray-400">{property.address}</p>
            </div>
            <span className="mt-2 sm:mt-0 text-md font-bold text-lime-400">
              {Number(property.price.toLocaleString()) / 10 ** 18} $AVAX
            </span>
          </div>

          {/* Details */}
          <div className="mb-4 flex flex-wrap items-center gap-3 text-sm text-gray-400">
            <span className="flex items-center">
              <Home className="w-4 h-4 mr-2" />
              {property.bedrooms} BHK
            </span>
            <span>•</span>
            <span className="flex items-center">
              <Maximize2 className="w-4 h-4 mr-2" />
              {property.sqft} sqft
            </span>
          </div>
          <div className="mb-4 flex flex-wrap items-center gap-3 text-sm text-gray-400">
            <span className="flex items-center">{property.ammenities}</span>
          </div>
          {/* Token Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-400">
            <div className="flex items-center">
              <span>Token Price:</span>
              <span className="font-medium text-lime-400 flex gap-1 items-center">
                <img
                  src="/avax_lime.svg"
                  alt="coin"
                  className="w-4 h-4 ml-2 items-center mt-1"
                />
                {Number(property.tokenPrice.toString()) / 10 ** 18}
              </span>
            </div>
            <div className="justify-self-start sm:justify-self-end">
              <span>Available:</span>
              <span className="ml-1 font-medium text-lime-400">
                {Number(property.availableTokens / 10 ** 18)} $PROP
              </span>
            </div>
          </div>
        </CardContent>

        {/* Footer */}
        <CardFooter className="flex flex-wrap items-center gap-2 p-4 pt-1">
          <Dialog onOpenChange={(open) => setShowInvestButton(!open)}>
            <DialogTrigger asChild>
              <Button
                className={`flex-1 text-sm ${
                  property.availableTokens > 0
                    ? "bg-lime-400 text-black hover:bg-lime-500"
                    : "bg-gray-700 text-white cursor-not-allowed"
                }`}
                disabled={property.availableTokens === 0}
              >
                {property.availableTokens > 0 ? "Invest" : "Fully Invested 🚫"}
              </Button>
            </DialogTrigger>

            {property.availableTokens > 0 && (
              <DialogContent className="bg-[#0A1A1F]">
                <DialogTitle className="text-lg font-semibold text-white">
                  Invest in {property.name}
                </DialogTitle>
                <p className="text-sm text-gray-400 mt-2">
                  You are about to invest in {property.name}. Are you sure you
                  want to proceed?
                </p>
                <div className="mt-4 flex gap-4">
                  <InvestForm property={property} />
                </div>
              </DialogContent>
            )}
          </Dialog>
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
          <Dialog>
            <DialogTrigger asChild>
              <Button
                size="icon"
                variant="outline"
                className="text-lime-400 border-lime-400 hover:text-lime-400 bg-gray-900 hover:bg-gray-800"
                onClick={getQuote}
              >
                <Quote className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="min-w-[900px] bg-gray-900/95 backdrop-blur-sm">
              {isQuoteLoading ? (
                <div className="flex justify-center items-center h-40">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-lime-400"></div>
                </div>
              ) : quoteInfo ? (
                <div className="p-6">
                  <div className="flex items-center space-x-4 mb-4">
                    <Avatar>
                      <AvatarImage src="/phil.png" alt="Phil Dunphy" />
                      <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="text-lg font-semibold text-white">
                        {quoteInfo.realtorName}
                      </h4>
                      <p className="text-sm text-gray-400">Trusted Realtor</p>
                    </div>
                  </div>
                  <blockquote className="text-white italic mb-4">
                    {quoteInfo.pitch}
                  </blockquote>
                  <div className="flex items-center space-x-2">
                    <span className="text-white">Rating:</span>
                    {renderRatingStars(quoteInfo.rating)}
                  </div>
                </div>
              ) : (
                <div className="p-6 text-center text-gray-400">
                  No quote available at this time.
                </div>
              )}
            </DialogContent>
          </Dialog>
          <Button
            size="icon"
            variant="outline"
            className="text-lime-400 border-lime-400 hover:text-lime-400 bg-gray-900 hover:bg-gray-800"
            onClick={() => addCompare(property)}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
