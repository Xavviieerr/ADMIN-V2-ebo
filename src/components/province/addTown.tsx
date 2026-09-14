import React from "react"
import { useForm } from "react-hook-form"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "../ui/form"
import { zodResolver } from "@hookform/resolvers/zod"
import z from "zod"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Checkbox } from "../ui/checkbox"
import { useGenericMutationMutation, useGetAllProvincesQuery } from "@/slice/requestSlice"
import { Province, ProvinceResponse } from "@/types/provinceTypes"
import { toast } from "sonner"
import { getErrorMessage } from "@/utils/errorHandler";
import LoadingSpinner from "../ui/LoadingSpinner"

const createTownSchema = z.object({
    provinceId: z.string().min(1, { message: "You must select a Parent Province" }),
    name: z.string().min(1, { message: "You must enter town Name" }),
    note: z.string().optional(),
    isWaterside: z.boolean().optional(),
})

interface AddTownProps {
    onSuccess?: () => void;
    provinceId?: string;
}

export default function AddTown({ onSuccess, provinceId }: AddTownProps) {
    const { data: getAllProvinces, isLoading, isError } = useGetAllProvincesQuery({page: 1, limit: 10000000000000});

    const allProvinces = getAllProvinces?.data?.data

    console.log(allProvinces);
    const [addTown, {isLoading:loading, isError:error}] = useGenericMutationMutation();

    const form = useForm<z.infer<typeof createTownSchema>>({
        resolver: zodResolver(createTownSchema),
        defaultValues: {
            provinceId: provinceId || "",
            name: "",
            isWaterside: undefined,
            note: ""
        },
    })

    // Update form when provinceId prop changes
    React.useEffect(() => {
        if (provinceId) {
            form.setValue('provinceId', provinceId);
        } else {
            form.setValue('provinceId', '');
        }
    }, [provinceId, form])

    async function onSubmit(values: z.infer<typeof createTownSchema>) {
        console.log("Form submitted:", values)
        try {
            await addTown({
                url: "/provinces/towns",
                method: "POST",
                body: values,
                invalidatesTags: [{ type: 'provinces' as const }, { type: 'town' as const }]
            }).unwrap().then((result) => {
                console.log("Province API Response:", result);

                // Check if province creation was successful
                if (result && (result.data || result.id || result.success !== false)) {
                    toast.success("New Town Added", {
                        description: "You successfully added a new town",
                    });

                    // Reset form after successful submission
                    form.reset();
                    
                    // Close modal if onSuccess callback is provided
                    if (onSuccess) {
                        onSuccess();
                    }
                } else {
                    console.error("Town creation failed - no valid response data");
                    toast.error("Failed to create town", {
                        description: "Please try again or contact support",
                    });
                }
            });
        } catch (err) {
            console.log(err, 'Province creation failed');
            toast.error(getErrorMessage(err, "Failed to create town"));
        }
    }

    return (
        <div className="mt-5">
            <p className="text-[20px] mt-4">Create New Town</p>
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-6"
                >
                    <div className="grid grid-cols-1 gap-y-10 rounded-lg p-4 bg-[#2a2a2a] mt-5">
                        {/* Town / Dialect Select */}
                        <FormField
                            control={form.control}
                            name="provinceId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <select
                                            {...field}
                                            className="bg-[#1e1e1e] border p-2 rounded-md w-full"
                                            disabled={!!provinceId}
                                        >
                                            <option value="">
                                                Parent Province
                                            </option>
                                            {allProvinces?.map((province: Province, index: number) =>
                                                <option key={province.id || index} value={province.id}>
                                                    {province.name}
                                                </option>
                                            )}
                                        </select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Town Name */}
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            placeholder="Town Name"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="note"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            placeholder="Notes (optional)"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="isWaterside"
                            render={({ field }) => (
                                <FormItem className="flex gap-3 items-center">
                                    <FormLabel>Is Waterside?</FormLabel>
                                    <FormControl>
                                        <Checkbox
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                            onBlur={field.onBlur}
                                            name={field.name}
                                            ref={field.ref}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="flex justify-start">
                            <Button
                                type="submit"
                                disabled={loading}
                                className="cursor-pointer bg-[#F5DEB3] text-[#1e1e1e] hover:bg-[#f5deb3]"
                            >
                                {loading ? <LoadingSpinner/> : "Create Town"}
                            </Button>
                        </div>
                    </div>
                </form>
            </Form>
        </div>
    )
}
