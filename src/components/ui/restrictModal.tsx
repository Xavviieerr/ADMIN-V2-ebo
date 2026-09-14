import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogHeader,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"


export function RestrictModal({isOpen, setIsOpen}: {isOpen: boolean, setIsOpen: (open: boolean) => void}) {

    return (
        <>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="text-[#F5DEB3] bg-[#1F1F27] p-6 rounded-lg w-full max-w-md">
                    <DialogHeader>
                        {/* <DialogTitle>Are you absolutely sure?</DialogTitle> */}
                        <DialogDescription className="text-lg text-center font-medium mb-4 text-[#F5DEB3]">
                            Are you sure you want to restrict this account?
                        </DialogDescription>
                    </DialogHeader>
                    <span className="flex justify-center mt-4">
                        <Button variant="destructive" className="mr-2">Yes, Restrict</Button>
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                    </span>
                </DialogContent>
            </Dialog>
        </>
    )
}

