import { toast } from "sonner";
import { getErrorMessage } from "@/utils/errorHandler";

type RunDictionaryMutationOptions = {
  run: () => Promise<unknown>;
  successMessage: string;
  errorMessage: string;
  onSuccess?: () => void;
};

export async function runDictionaryMutation({
  run,
  successMessage,
  errorMessage,
  onSuccess,
}: RunDictionaryMutationOptions): Promise<boolean> {
  try {
    await run();
    toast.success(successMessage);
    onSuccess?.();
    return true;
  } catch (error) {
    toast.error(getErrorMessage(error, errorMessage));
    return false;
  }
}
