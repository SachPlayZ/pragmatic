import { z } from "zod";
import { useForm } from "react-hook-form";
import { Property } from "@/interfaces/interface";
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
  DialogClose,
} from "./ui/dialog";

interface ListForm {
  property: Property;
}

const formSchema = z.object({
  name: z.string().min(1, "Name cannot be empty"),
  location: z.string().min(1, "Location cannot be empty"),
  price: z
    .string()
    .refine((val) => !isNaN(Number(val)), {
      message: "Price must be a number",
    })
    .transform((val) => Number(val))
    .refine((val) => val >= 5 && val <= 20, {
      message: "must be between 5 and 20",
    }),
  // totalTokens: z
  //   .string()
  //   .refine((val) => !isNaN(Number(val)), {
  //     message: "Total tokens must be a number",
  //   })
  //   .transform((val) => Number(val)),
  // availableTokens: z
  //   .string()
  //   .refine((val) => !isNaN(Number(val)), {
  //     message: "Available tokens must be a number",
  //   })
  //   .transform((val) => Number(val)),
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

  // totalTokens: z.number().min(1, "Total tokens cannot be empty"),
  // availableTokens: z.number().min(0, "Available tokens cannot be negative"),
  // imageUrl: z.string().min(1, "Image URL cannot be empty").url(),
  // bedrooms: z.number().min(1, "Bedrooms cannot be empty"),
  // sqft: z.number().min(1, "Square feet cannot be empty"),
});

function ListForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      location: "",
      price: 0,
      imageUrl: "",
      bedrooms: 0,
      sqft: 0,
    },
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    try {
      console.log("Form submitted:", data);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="gap-2 bg-lime-400 text-black hover:bg-lime-500"
        >
          <PlusIcon className="h-4 w-4" />
          Add your property
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-[#0A1A1F]/70 backdrop-blur-md border text-white border-[#D0FD3E] w-[90%] max-w-lg min-h-[75vh]">
        <DialogTitle className="text-center">Add your Property</DialogTitle>
        <DialogDescription className="text-center">
          {" "}
          Fill in the details of your property to list it on the marketplace
        </DialogDescription>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-2 p-2"
          >
            <div className="flex flex-col space-y-2">
              {/* Name Field */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm sm:text-base">
                      Name of property
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Villa Paradise"
                        {...field}
                        className="text-sm px-2 py-1 sm:px-3 sm:py-2 text-black"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/*Location Field */}
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm sm:text-base">
                      Location
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Image URL: https://example.com/image.jpg"
                        {...field}
                        className="text-sm px-2 py-1 sm:px-3 sm:py-2 text-black"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Price Field */}
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm sm:text-base">
                    Price (in TKX)
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Price (in AVAX)"
                      {...field}
                      className="text-sm px-2 py-1 sm:px-3 sm:py-2 text-black"
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
                  <FormLabel className="text-xs sm:text-sm">Bedrooms</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Bedrooms"
                      {...field}
                      className="text-xs sm:text-sm px-2 py-1 sm:px-3 sm:py-2 text-black"
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Square Feet Field */}
            <FormField
              control={form.control}
              name="sqft"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs sm:text-sm">
                    Square Feet
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Square Feet"
                      {...field}
                      className="text-xs sm:text-sm px-2 py-1 sm:px-3 sm:py-2 text-black"
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* List CTA button*/}
            <DialogClose className="flex justify-center mt-10 pt-3">
              <Button
                type="submit"
                className="bg-lime-400 text-black hover:bg-lime-500"
              >
                List Property
              </Button>
            </DialogClose>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default ListForm;
