'use client'
import { useGenericMutationMutation, useGetSingleProvinceQuery, useUpdateTownMutation } from '@/slice/requestSlice'
import React, { useState, useMemo } from 'react'
import { toast } from 'sonner';
import { getErrorMessage } from "@/utils/errorHandler";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import AddProvince from './addProvince'
import AddTown from './addTown'
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Edit } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import LoadingSpinner from '../ui/LoadingSpinner';

const updateTownSchema = z.object({
    name: z.string().min(1, { message: "You must enter town Name" }),
    isWaterside: z.boolean(),
    note: z.string().optional(),
    latitude: z.number().optional(),
    longitude: z.number().optional(),
    provinceId: z.string().min(1, { message: "Province ID is required" }),
});

export default function SingleProvince({ id }: { id: string }) {
    const [isAddProvinceOpen, setIsAddProvinceOpen] = useState(false);
    const [isAddTownOpen, setIsAddTownOpen] = useState(false);
    const [deleteProvinceModalOpen, setDeleteProvinceModalOpen] = useState(false);
    const [deleteTownModalOpen, setDeleteTownModalOpen] = useState(false);
    const [editTownModalOpen, setEditTownModalOpen] = useState(false);
    const [townToDelete, setTownToDelete] = useState<{ id: string; name: string } | null>(null);
    const [townToEdit, setTownToEdit] = useState<any | null>(null);
    const { data: provinceSingle, isLoading, isError } = useGetSingleProvinceQuery({ id });
    const [deleteProvince, { isLoading: isDeleting }] = useGenericMutationMutation();
    const [deleteTown, { isLoading: isDeletingTown }] = useGenericMutationMutation();
    const [updateTown, { isLoading: isUpdatingTown }] = useUpdateTownMutation();
    const router = useRouter();

    const singleProvince = provinceSingle?.data;

    // Sort towns alphabetically by name
    const sortedTowns = useMemo(() => {
        if (!singleProvince?.towns) return [];
        return [...singleProvince.towns].sort((a, b) => 
            (a.name || '').localeCompare(b.name || '', undefined, { sensitivity: 'base' })
        );
    }, [singleProvince?.towns]);

    // Form for editing town
    const editTownForm = useForm<z.infer<typeof updateTownSchema>>({
        resolver: zodResolver(updateTownSchema),
        defaultValues: {
            name: '',
            isWaterside: false,
            note: '',
            latitude: undefined,
            longitude: undefined,
            provinceId: id,
        },
    });

    // Update form when townToEdit changes
    React.useEffect(() => {
        if (townToEdit) {
            editTownForm.reset({
                name: townToEdit.name || '',
                isWaterside: townToEdit.isWaterside || false,
                note: townToEdit.note || undefined,
                latitude: townToEdit.latitude ?? undefined,
                longitude: townToEdit.longitude ?? undefined,
                provinceId: id,
            });
        }
    }, [townToEdit, id, editTownForm]);

    const handleEditTown = (town: any) => {
        setTownToEdit(town);
        setEditTownModalOpen(true);
    };

    const handleUpdateTown = async (values: z.infer<typeof updateTownSchema>) => {
        if (!townToEdit) return;

        try {
            // Build update payload - only include optional fields if they have values
            const updateData = {
                id: townToEdit.id,
                name: values.name,
                isWaterside: values.isWaterside,
                provinceId: values.provinceId,
                ...(values.note !== undefined && values.note !== null && values.note !== '' && { note: values.note }),
                ...(values.latitude !== undefined && values.latitude !== null && { latitude: values.latitude }),
                ...(values.longitude !== undefined && values.longitude !== null && { longitude: values.longitude }),
            };

            await updateTown(updateData).unwrap();
            toast.success("Town Updated", {
                description: `"${values.name}" has been successfully updated.`,
            });
            setEditTownModalOpen(false);
            setTownToEdit(null);
        } catch (err) {
            console.error('Update town failed:', err);
            toast.error(getErrorMessage(err, "Failed to update town"));
        }
    };

    // ✅ Delete Province
    const handleDeleteProvince = (provinceId: string, provinceName: string) => {
        setDeleteProvinceModalOpen(true);
    };

    const confirmDeleteProvince = async () => {
        try {
            await deleteProvince({
                url: `/provinces/${id}`,
                method: "DELETE",
                invalidatesTags: [{ type: 'provinces' as const }]
            }).unwrap();
            toast.success("Province Deleted", {
                description: `"${singleProvince?.name}" has been successfully deleted`,
            });
            setDeleteProvinceModalOpen(false);
            router.back();
        } catch (err) {
            console.error('Delete province failed:', err);
            toast.error(getErrorMessage(err, "Failed to delete province"));
        }
    };

    // ✅ Delete Town
    const handleDeleteTown = (townId: string, townName: string) => {
        setTownToDelete({ id: townId, name: townName });
        setDeleteTownModalOpen(true);
    };

    const confirmDeleteTown = async () => {
        if (!townToDelete) return;

        try {
            await deleteTown({
                url: `/provinces/towns/${townToDelete.id}`,
                method: "DELETE",
                invalidatesTags: [{ type: 'town' as const }] // refresh province data after deletion
            }).unwrap();
            toast.success("Town Deleted", {
                description: `"${townToDelete.name}" has been successfully deleted.`,
            });
            setDeleteTownModalOpen(false);
            setTownToDelete(null);
        } catch (err) {
            console.error('Delete town failed:', err);
            toast.error(getErrorMessage(err, "Failed to delete town"));
        }
    };

    const handleBack = () => {
        router.push('/province')
    }

    return (
        <div>
            {/* Back Button */}
            <div className="mb-6">
                <Button
                    onClick={handleBack}
                    variant="ghost"
                    className="text-gray-300 hover:text-white hover:bg-[#2a2a2a] flex items-center gap-2"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Provinces List
                </Button>
            </div>
            
            <div className="flex justify-between items-center mb-6 flex-wrap md:mt-0 mt-10 space-y-3 md:space-y-0">
                <h1 className="text-2xl font-semibold text-white">{singleProvince?.name}</h1>
                <div className="flex gap-3">
                    <button
                        onClick={() => setIsAddProvinceOpen(true)}
                        className="bg-[#F5DEB3] text-[#1e1e1e] px-4 py-2 rounded-md font-medium hover:bg-[#f5deb3]/90 transition-colors"
                    >
                        Update Province
                    </button>
                    <button
                        onClick={() => handleDeleteProvince(id, singleProvince?.name ?? '')}
                        className="bg-[#2a2a2a] text-white px-4 py-2 rounded-md font-medium hover:bg-red-500 transition-colors border border-white/10"
                    >
                        Delete Province
                    </button>
                </div>
            </div>

            {isLoading && <p className="text-sm text-white/70">Loading province...</p>}
            {isError && <p className="text-sm text-red-400">Failed to load province.</p>}

            {singleProvince?.description && (
                <p className="text-white/80 mb-6">{singleProvince.description}</p>
            )}

            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-medium text-white">Towns</h2>
                    {(
                        <button
                            onClick={() => setIsAddTownOpen(true)}
                            className="bg-[#2a2a2a] text-white px-4 py-2 rounded-md font-medium hover:bg-[#3a3a3a] transition-colors border border-white/10"
                        >
                            Add Town
                        </button>
                    )}
                </div>
                {sortedTowns && sortedTowns.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {sortedTowns.map((town) => (
                            <div key={town.id} className="bg-[#2a2a2a] border border-white/10 rounded-md p-4">
                                <div className="flex items-center justify-between">
                                    <p className="font-semibold">{town.name}</p>
                                    <span
                                        className={`text-xs px-2 py-1 rounded-md ${town.isWaterside ? 'bg-blue-500/20 text-blue-300' : 'bg-white/10 text-white/70'
                                            }`}
                                    >
                                        {town.isWaterside ? 'Waterside' : 'Inland'}
                                    </span>
                                </div>

                                {town.note && (
                                    <p className="text-sm text-white/70 mt-2">{town.note}</p>
                                )}

                                <div className="mt-3 text-xs text-white/70">
                                    <p>Latitude: {town.latitude ?? 'N/A'}</p>
                                    <p>Longitude: {town.longitude ?? 'N/A'}</p>
                                </div>

                                {/* ✅ Edit and Delete Town Buttons */}
                                <div className="mt-4 flex justify-end gap-2">
                                    <button
                                        onClick={() => handleEditTown(town)}
                                        className="text-blue-400 text-sm hover:text-blue-500 font-medium transition-colors flex items-center gap-1"
                                    >
                                        <Edit className="h-4 w-4" />
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDeleteTown(town.id, town.name)}
                                        className="text-red-400 text-sm hover:text-red-500 font-medium transition-colors"
                                        disabled={isDeletingTown}
                                    >
                                        {isDeletingTown ? 'Deleting...' : 'Delete'}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-white/70">No towns added yet.</p>
                )}
            </div>

            <Dialog open={isAddProvinceOpen} onOpenChange={setIsAddProvinceOpen}>
                <DialogContent className=' text-white bg-[#2a2a2a]'>
                    <div className="mb-2">
                        <h3 className="text-lg font-semibold bg-ac">Update Province</h3>
                    </div>
                    <AddProvince
                        onSuccess={() => setIsAddProvinceOpen(false)}
                        mode="update"
                        provinceId={id}
                        province={singleProvince}
                    />
                </DialogContent>
            </Dialog>

            {/* Add Town Modal */}
            <Dialog open={isAddTownOpen} onOpenChange={setIsAddTownOpen}>
                <DialogContent className="text-white bg-[#1F1F27] p-6 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-semibold text-white mb-4">
                            Add New Town
                        </DialogTitle>
                    </DialogHeader>
                    <AddTown 
                        onSuccess={() => setIsAddTownOpen(false)} 
                        provinceId={id}
                    />
                </DialogContent>
            </Dialog>

            {/* Delete Province Confirmation Modal */}
            <Dialog open={deleteProvinceModalOpen} onOpenChange={setDeleteProvinceModalOpen}>
                <DialogContent className="bg-[#1E1E1E] border border-white/10 text-white">
                    <DialogHeader>
                        <DialogTitle>Confirm Deletion</DialogTitle>
                        <DialogDescription className="text-gray-400">
                            Are you sure you want to delete "{singleProvince?.name}"? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="ghost"
                            onClick={() => setDeleteProvinceModalOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={confirmDeleteProvince}
                            disabled={isDeleting}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            {isDeleting ? 'Deleting...' : 'Delete'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Town Confirmation Modal */}
            <Dialog open={deleteTownModalOpen} onOpenChange={setDeleteTownModalOpen}>
                <DialogContent className="bg-[#1E1E1E] border border-white/10 text-white">
                    <DialogHeader>
                        <DialogTitle>Confirm Deletion</DialogTitle>
                        <DialogDescription className="text-gray-400">
                            Are you sure you want to delete the town "{townToDelete?.name}"? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="ghost"
                            onClick={() => {
                                setDeleteTownModalOpen(false);
                                setTownToDelete(null);
                            }}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={confirmDeleteTown}
                            disabled={isDeletingTown}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            {isDeletingTown ? 'Deleting...' : 'Delete'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Edit Town Modal */}
            <Dialog open={editTownModalOpen} onOpenChange={(open) => {
                setEditTownModalOpen(open);
                if (!open) {
                    setTownToEdit(null);
                }
            }}>
                <DialogContent className="bg-[#1E1E1E] border border-white/10 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-semibold text-white mb-4">
                            Edit Town
                        </DialogTitle>
                    </DialogHeader>
                    <Form {...editTownForm}>
                        <form onSubmit={editTownForm.handleSubmit(handleUpdateTown)} className="space-y-6">
                            <div className="grid grid-cols-1 gap-y-6 rounded-lg p-4 bg-[#2a2a2a]">
                                {/* Town Name */}
                                <FormField
                                    control={editTownForm.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-white">Town Name</FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    placeholder="Town Name"
                                                    className="bg-[#1e1e1e] border-white/10 text-white"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Note */}
                                <FormField
                                    control={editTownForm.control}
                                    name="note"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-white">Note (optional)</FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    value={field.value ?? ''}
                                                    placeholder="Notes (optional)"
                                                    className="bg-[#1e1e1e] border-white/10 text-white"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Is Waterside */}
                                <FormField
                                    control={editTownForm.control}
                                    name="isWaterside"
                                    render={({ field }) => (
                                        <FormItem className="flex gap-3 items-center">
                                            <FormLabel className="text-white">Is Waterside?</FormLabel>
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

                                {/* Latitude */}
                                <FormField
                                    control={editTownForm.control}
                                    name="latitude"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-white">Latitude (optional)</FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    type="number"
                                                    step="any"
                                                    placeholder="Latitude"
                                                    className="bg-[#1e1e1e] border-white/10 text-white"
                                                    value={field.value ?? ''}
                                                    onChange={(e) => {
                                                        const val = e.target.value;
                                                        field.onChange(val === '' ? undefined : parseFloat(val));
                                                    }}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Longitude */}
                                <FormField
                                    control={editTownForm.control}
                                    name="longitude"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-white">Longitude (optional)</FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    type="number"
                                                    step="any"
                                                    placeholder="Longitude"
                                                    className="bg-[#1e1e1e] border-white/10 text-white"
                                                    value={field.value ?? ''}
                                                    onChange={(e) => {
                                                        const val = e.target.value;
                                                        field.onChange(val === '' ? undefined : parseFloat(val));
                                                    }}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <div className="flex justify-end gap-2 pt-4">
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        onClick={() => {
                                            setEditTownModalOpen(false);
                                            setTownToEdit(null);
                                        }}
                                        className="text-white hover:bg-[#3a3a3a]"
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        disabled={isUpdatingTown}
                                        className="cursor-pointer bg-[#F5DEB3] text-[#1e1e1e] hover:bg-[#f5deb3]"
                                    >
                                        {isUpdatingTown ? <LoadingSpinner /> : "Update Town"}
                                    </Button>
                                </div>
                            </div>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>
        </div>
    )
}
