import { z } from "zod";
import { useForm } from "react-hook-form";
import { Property } from "@/interfaces/interface";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

interface ListForm {
  property: Property;
}

const formSchema = z.object({
  name: z.string(),
  location: z.string(),
  price: z.number(),
  tokenPrice: z.number(),
  totalTokens: z.number(),
  availableTokens: z.number(),
  imageUrl: z.string(),
  bedrooms: z.number(),
  bathrooms: z.number(),
  sqft: z.number(),
});

function ListForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      location: "",
      price: 0,
      tokenPrice: 0,
      totalTokens: 0,
      availableTokens: 0,
      imageUrl: "",
      bedrooms: 0,
      bathrooms: 0,
      sqft: 0,
    },
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    console.log(data);
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                    className="text-sm px-2 py-1 sm:px-3 sm:py-2"
                  />
                </FormControl>
              </FormItem>
            )}
          />

          {/* Duration Field */}
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
                    placeholder="Duration"
                    {...field}
                    className="text-sm px-2 py-1 sm:px-3 sm:py-2"
                  />
                </FormControl>
                <FormDescription className="text-xs sm:text-sm">
                  Duration must be between 3-6 months.
                </FormDescription>
                <FormMessage className="text-red-600 text-xs sm:text-sm" />
              </FormItem>
            )}
          />

          {/* Hidden Inputs 
           <input
            type="hidden"
            {...form.register("title")}
            value={policy.title}
          />
          <input
            type="hidden"
            {...form.register("description")}
            value={policy.description}
          />
          <input
            type="hidden"
            {...form.register("riskLevel")}
            value={policy.riskLevel}
          /> */}

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row justify-between space-y-2 sm:space-y-0 sm:space-x-4">
            {/* <Button
              type="button"
              onClick={calcPremium}
              className="w-full sm:w-auto text-text bg-red-950 outline-double px-3 py-2 text-sm"
            >
              Calculate Premium
            </Button> */}
            <Button
              type="submit"
              className="w-full sm:w-auto text-text bg-red-950 outline-double px-3 py-2 text-sm"
            >
              Get Policy
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
}

export default ListForm;
