import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Input } from "./ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { useWriteContract } from "wagmi";
import { Button } from "./ui/button";
import { contractAbi, contractAddress } from "@/abi";
import { parseEther } from "viem";

export default function InvestForm(props: any) {
  const { property } = props;
  console.log(property.id);
  const { writeContractAsync } = useWriteContract();

  const formSchema = z.object({
    amount: z
      .string()
      .transform((val) => Number(val))
      .refine((val) => val > 0, {
        message: "Amount must be greater than 0",
      })
      .refine((val) => val <= Number(property.price) / 10 ** 18, {
        message: `Amount must be less than ${
          Number(property.price) / 10 ** 18
        } AVAX`,
      }),
    proposedRate: z
      .string()
      .transform((val) => Number(val))
      .refine((val) => val >= 5 && val <= 20, {
        message: "Proposed rate must be between 5 and 20",
      }),
    propertyId: z.string().transform((val) => Number(val)),
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: "",
      proposedRate: "",
      propertyId: "",
    },
  });

  async function onSubmit(data: any) {
    console.log(data);
    // Call the invest API here
    const amt = parseEther(data.amount.toString());
    try {
      const tx = await writeContractAsync(
        {
          address: contractAddress,
          abi: contractAbi,
          functionName: "invest",
          args: [data.propertyId, data.proposedRate],
          value: amt,
        },
        {
          onSuccess(data: any) {
            console.log("Transaction successful!", data);
          },
          onSettled(data: any, error: any) {
            if (error) {
              console.error("Error on settlement:", error);
            } else {
              console.log("Transaction settled:", data);
            }
          },
        }
      );
      if (tx) {
        console.log("Transaction hash:", tx);
      }
    } catch (error) {
      console.error("Error submitting transaction:", error);
    }
    form.reset();
  }

  return (
    <div className="bg-gray-900 text-white w-full">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 p-2">
          {/* Property Name Input */}
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Amount (in AVAX)</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Amount in AVAX"
                    {...field}
                    className="bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:ring-lime-400 focus:border-lime-400"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Proposed Rate Input */}
          <FormField
            control={form.control}
            name="proposedRate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Proposed Rate (%)</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Proposed Rate"
                    {...field}
                    className="bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:ring-lime-400 focus:border-lime-400"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="propertyId"
            render={({ field }) => (
              <FormItem className="hidden">
                <FormControl>
                  <Input type="hidden" {...field} value={property.id - 1} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-lime-400 to-lime-500 text-white font-semibold p-2 rounded-lg"
          >
            Invest
          </Button>
        </form>
      </Form>
    </div>
  );
}
