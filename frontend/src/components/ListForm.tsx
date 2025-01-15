import { useEffect, useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
// import { Map, MapPin } from "lucide-react";
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
import MapComponent from "./functions/Map";

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
    .refine((val) => val >= 5 && val <= 20, {
      message: "must be between 5 and 20",
    }),
  imageUrl: z.string().min(1, "Image URL cannot be empty").url(),
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
  const [open, setOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      location: { lng: 0, lat: 0 },
      price: 0,
      imageUrl: "",
      bedrooms: 0,
      sqft: 0,
    },
  });

  const handleImageUrlChange = (e: any) => {
    const url = e.target.value;
    form.setValue("imageUrl", url);
    setPreviewUrl(url);
  };

  async function onSubmit(data: any) {
    try {
      console.log("Form submitted:", data);
      setOpen(false);
      form.reset();
      setPreviewUrl("");
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  }

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
      <DialogContent className="bg-[#0A1A1F]/70 backdrop-blur-md border text-white border-[#D0FD3E] w-[90%] max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogTitle className="text-center">Add your Property</DialogTitle>
        <DialogDescription className="text-center">
          Fill in the details of your property to list it on the marketplace
        </DialogDescription>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 p-2"
          >
            {/* Name Field */}
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
                      className="text-black"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
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

            {/* Image URL Field */}
            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Property Image URL</FormLabel>
                  <FormControl>
                    <Input
                      type="url"
                      placeholder="https://example.com/image.jpg"
                      {...field}
                      onChange={handleImageUrlChange}
                      className="text-black"
                    />
                  </FormControl>
                  {previewUrl && (
                    <div className="mt-2 rounded overflow-hidden">
                      <img
                        src={previewUrl}
                        alt="Property preview"
                        className="w-full h-48 object-cover"
                        onError={() => setPreviewUrl("")}
                      />
                    </div>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Price Field */}
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price (in TKX)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Price (in TKX)"
                      {...field}
                      className="text-black"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Bedrooms Field */}
            <FormField
              control={form.control}
              name="bedrooms"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bedrooms</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Number of bedrooms"
                      {...field}
                      className="text-black"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Square Feet Field */}
            <FormField
              control={form.control}
              name="sqft"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Square Feet</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Property size in square feet"
                      {...field}
                      className="text-black"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full bg-lime-400 text-black hover:bg-lime-500"
            >
              List Property
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default ListForm;
