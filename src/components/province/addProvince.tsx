import { useEffect } from "react";
import { useForm } from "react-hook-form";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { useGenericMutationMutation } from "@/slice/requestSlice";
import LoadingSpinner from "../ui/LoadingSpinner";
import { toast } from "sonner";
import { getErrorMessage } from "@/utils/errorHandler";

const createProvinceSchema = z.object({
    name: z.string().min(2, { message: "You must Enter Province Name" }),
    description: z.string().min(2, { message: "You need to add description" }),
});

interface AddProvinceProps {
    onSuccess?: () => void;
    mode?: 'create' | 'update';
    provinceId?: string;
    province?: { name?: string; description?: string } | null;
}

export default function AddProvince({ onSuccess, mode = 'create', provinceId, province }: AddProvinceProps) {
    const [provinceRequest, { isLoading }] = useGenericMutationMutation();
    const form = useForm<z.infer<typeof createProvinceSchema>>({
        resolver: zodResolver(createProvinceSchema),
        defaultValues: {
            name: "",
            description: "",
        },
    });

    useEffect(() => {
        if (mode === 'update' && province) {
            form.reset({
                name: province.name || "",
                description: province.description || "",
            });
        }
    }, [mode, province, form]);

    async function onSubmit(values: z.infer<typeof createProvinceSchema>) {
        console.log("Form submitted:", values);
        try {
            const request = mode === 'update'
                ? {
                    url: `/provinces/${provinceId}`,
                    method: "PATCH" as const,
                    body: values,
                    invalidatesTags: [{ type: 'provinces' as const }]
                }
                : {
                    url: "/provinces",
                    method: "POST" as const,
                    body: values,
                    invalidatesTags: [{ type: 'provinces' as const }]
                };

            await provinceRequest(request).unwrap().then((result) => {
                console.log("Province API Response:", result);

                // Check if province creation was successful
                if (result && (result.data || result.id || result.success !== false)) {
                    toast.success(mode === 'update' ? "Province Updated" : "New Province Added", {
                        description: mode === 'update' ? "Province has been updated" : "You successfully added a new province",
                    });

                    // Reset form after successful submission
                    form.reset();
                    
                    // Close modal if onSuccess callback is provided
                    if (onSuccess) {
                        onSuccess();
                    }
                } else {
                    console.error("Province request failed - no valid response data");
                    toast.error(mode === 'update' ? "Failed to update province" : "Failed to create province", {
                        description: "Please try again or contact support",
                    });
                }
            });
        } catch (err) {
            console.log(err, 'Province request failed');
            toast.error(getErrorMessage(err, mode === 'update' ? "Failed to update province" : "Failed to create province"));
        }
    }

    return (
        <div>
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-6"
                >
                    <div className="grid grid-cols-1 gap-y-6 rounded-lg p-4 bg-[#2a2a2a]">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            placeholder="Province Name"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Textarea
                                            rows={10}
                                            {...field}
                                            className="p-3"
                                            placeholder="Description"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="flex justify-start">
                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="cursor-pointer bg-[#F5DEB3] text-[#1e1e1e] hover:bg-[#f5deb3]"
                            >
                                {isLoading ? <LoadingSpinner /> : (mode === 'update' ? 'Update Province' : 'Create Province')}
                            </Button>
                        </div>
                    </div>
                </form>
            </Form>
        </div>
    );
}
