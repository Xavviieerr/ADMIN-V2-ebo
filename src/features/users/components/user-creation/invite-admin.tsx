"use client";
import { Loader } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import ModalLayout from "@/features/shared/modal-layout";
import { getErrorMessage } from "@/utils/errorHandler";
import { useInviteAdminMutation } from "@/slice/requestSlice";
import { inviteAdminSchema } from "../../schemas/userActions";

const InviteAdmin = ({
  show,
  setShow,
}: {
  show: boolean;
  setShow: (value: boolean) => void;
}) => {
  const [email, setEmail] = useState("");
  const [fieldError, setFieldError] = useState<string | null>(null);
  const [inviteAdminMutation, { isLoading }] = useInviteAdminMutation();

  useEffect(() => {
    if (show) {
      setEmail("");
      setFieldError(null);
    }
  }, [show]);

  const handleInvite = async () => {
    const parsed = inviteAdminSchema.safeParse({ email });
    if (!parsed.success) {
      const message = parsed.error.issues[0]?.message ?? "Please enter a valid email address";
      setFieldError(message);
      return toast.error(message);
    }
    setFieldError(null);
    try {
      await inviteAdminMutation({ email: parsed.data.email }).unwrap();
      toast.success("Admin invited successfully");
      setShow(false);
      setEmail("");
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to invite admin"));
    }
  };

  if (!show) return null;

  return (
    <ModalLayout size="2xl">
      <div className="flex flex-col items-center gap-2 w-full py-4">

        <h1 className="font-semibold text-2xl">Invite Admin</h1>

        <p className="font-medium mb-6">
          Enter the admin&apos;s email to send an invitation.
        </p>

        <div className="flex flex-col gap-2 w-full">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            placeholder="Enter the invitee's email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input"
          />
        </div>

        {fieldError && (
          <p role="alert" className="text-sm text-red-400 self-start">
            {fieldError}
          </p>
        )}

        <div className="flex items-center gap-4 w-full mt-5 font-medium">
          <button
            onClick={() => setShow(false)}
            disabled={isLoading}
            className="secondary-btn w-full"
          >
            Cancel
          </button>
          <button
            onClick={handleInvite}
            className="primary-btn w-full flex justify-center"
            disabled={isLoading}
          >
            {isLoading ? <Loader className="animate-spin" /> : "Invite"}
          </button>
        </div>
      </div>
    </ModalLayout>
  );
};

export default InviteAdmin;
