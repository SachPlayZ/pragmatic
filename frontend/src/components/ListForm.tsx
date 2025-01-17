import { useEffect, useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { PlusIcon } from "lucide-react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import MapComponent from "./functions/Map";
import { useAccount } from "wagmi";
import { usePropertyListing } from "../components/functions/ListProperty";
import { useToast } from "@/hooks/use-toast";

// Form validation schema defines the expected shape and validation rules for our form data
const formSchema = z.object({
  name: z.string().min(1, "Name cannot be empty"),
  location: z.object({
    lat: z.number(),
    lng: z.number(),
  }),
  price: z
    .string()
    .refine((val) => !isNaN(Number(val)), {
      message: "Price must be a number",
    })
    .transform((val) => Number(val))
    .refine((val) => val >= 1 && val <= 20, {
      message: "Price must be between 1 and 20 AVAX",
    }),
  file: z.instanceof(File).optional(),
  bedrooms: z
    .string()
    .refine((val) => !isNaN(Number(val)), {
      message: "Bedrooms must be a number",
    })
    .transform((val) => Number(val)),
  sqft: z
    .string()
    .refine((val) => !isNaN(Number(val)), {
      message: "Square feet must be a number",
    })
    .transform((val) => Number(val)),
});

function ListForm() {
  const { address } = useAccount();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);

  // Initialize form with Zod validation
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      location: { lng: 0, lat: 0 },
      price: 0,
      file: null,
      bedrooms: 0,
      sqft: 0,
    },
  });

  // Initialize our custom hook for handling property listing on the blockchain
  const {
    transactionStatus,
    loadingListing,
    submitTxListingLoading,
    successListing,
    submitTxListingSuccess,
    errorListing,
    submitTxError,
    listProperty,
  } = usePropertyListing({ price: form.watch("price") || 0 });

  // Main form submission handler that coordinates both blockchain and backend operations
  async function onSubmit(data: any) {
    try {
      // First initiate the blockchain transaction
      await listProperty();
      console.log("Form data:", data);

      // Only proceed with the rest if blockchain transaction succeeds
      // if (submitTxListingSuccess) {
      // Handle image upload to Cloudinary
      const formData = new FormData();
      formData.append("file", data.file);
      formData.append("upload_preset", "tokenx-prop");

      const imageUploadResponse = await fetch(
        "https://api.cloudinary.com/v1_1/de9fzqkly/image/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!imageUploadResponse.ok) {
        throw new Error("Failed to upload image");
      }

      const imageData = await imageUploadResponse.json();

      // Submit property data to our backend
      const propertyResponse = await fetch(
        `${import.meta.env.VITE_PUBLIC_BACKEND_URL}/property`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            owner: address,
            name: data.name,
            location: `${data.location.lat},${data.location.lng}`,
            price: (data.price * 10 ** 18).toString(),
            bedrooms: data.bedrooms,
            sqft: data.sqft,
            imageUrl: imageData.url,
            ammenities: "bamboo",
          }),
        }
      );

      console.log("Property response:", propertyResponse);

      if (propertyResponse.ok) {
        setOpen(false);
        if (successListing)
          toast({
            title: "Property Listed",
            description: "Your property has been listed successfully",
          });
        form.reset();
      } else {
        throw new Error("Failed to save property details");
      }
    } catch (error) {
      console.error("Error in property listing process:", error);
      if (errorListing || submitTxError)
        toast({
          title: "Error",
          description: "Failed to list property",
        });
    }
  }

  // Handle map coordinate updates
  const [coordinate, setCoordinate] = useState([0, 0]);

  useEffect(() => {
    if (coordinate[0] !== 0) {
      form.setValue("location", { lng: coordinate[0], lat: coordinate[1] });
    }
  }, [coordinate, form]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="gap-2 bg-lime-400 text-black hover:bg-lime-500"
        >
          <PlusIcon className="h-4 w-4" />
          Add your property
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-gradient-to-br from-gray-900 to-gray-800 backdrop-blur-lg border text-white border-lime-400 rounded-xl w-[90%] max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogTitle className="text-center">Add your Property</DialogTitle>
        <DialogDescription className="text-center">
          Fill in the details of your property to list it on the marketplace
        </DialogDescription>

        {/* Transaction Status Alert */}
        {transactionStatus.status && (
          <Alert
            className={`mb-4 ${
              submitTxListingSuccess
                ? "bg-green-500/20"
                : submitTxError
                ? "bg-red-500/20"
                : "bg-blue-500/20"
            }`}
          >
            <AlertDescription>
              {transactionStatus.status}
              {transactionStatus.hash && (
                <span className="block text-xs mt-1 opacity-80">
                  Transaction Hash: {transactionStatus.hash}
                </span>
              )}
            </AlertDescription>
          </Alert>
        )}

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 p-2"
          >
            {/* Property Name Input */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name of property</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Villa Paradise"
                      {...field}
                      className="bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:ring-lime-400 focus:border-lime-400"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Location Selection Map */}
            <FormField
              control={form.control}
              name="location"
              render={({}) => (
                <FormItem>
                  <FormLabel>Select Location</FormLabel>
                  <Card className="border border-gray-300">
                    <CardContent className="p-2">
                      <MapComponent setCoordinate={setCoordinate} />
                      {coordinate[0] !== 0 && (
                        <p className="text-xs mt-2 text-gray-400">
                          Selected: {coordinate[0].toFixed(6)},{" "}
                          {coordinate[1].toFixed(6)}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex space-x-4">
              {/* Image Upload Input */}
              <FormField
                control={form.control}
                name="file"
                render={({ field: { value, onChange, ...field } }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Property Image</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            onChange(file);
                          }
                        }}
                        {...field}
                        className="bg-gray-800 border-gray-700 text-white file:mr-4 file:py-[0.1rem] file:px-4
                        file:rounded-md file:border-0
                        file:text-sm file:font-semibold
                        file:bg-lime-400 file:text-black
                        hover:file:bg-lime-500
                        file:pointer-events-auto
                        focus:ring-lime-400 focus:border-lime-400"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Price Input */}
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Price (in AVAX)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Price (in AVAX)"
                        {...field}
                        className="bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:ring-lime-400 focus:border-lime-400"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex space-x-4">
              {/* Bedrooms Input */}
              <FormField
                control={form.control}
                name="bedrooms"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Bedrooms</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Number of bedrooms"
                        {...field}
                        className="bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:ring-lime-400 focus:border-lime-400"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Square Feet Input */}
              <FormField
                control={form.control}
                name="sqft"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Square Feet</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Property size in square feet"
                        {...field}
                        className="bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:ring-lime-400 focus:border-lime-400"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-lime-400 to-green-500 text-black font-semibold hover:from-lime-500 hover:to-green-600 transition duration-300 ease-in-out"
              disabled={loadingListing || submitTxListingLoading}
            >
              {loadingListing || submitTxListingLoading
                ? "Processing..."
                : "List Property"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default ListForm;
