"use client";
import { BASE_URL } from "@/utils/constants";
import { Loader } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { getAccessToken } from "@/features/auth/utils/tokenStorage";
import ModalLayout from "@/features/shared/modal-layout";

const InviteAdmin = ({
  show,
  setShow,
}: {
  show: boolean;
  setShow: (value: boolean) => void;
}) => {
  const [formData, setFormData] = useState({
    email: "",
    role: "",
  });
  const [loading, setLoading] = useState(false);
  const token = getAccessToken();

  const inviteAdmin = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/admin/invite`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ email: formData.email }),
      });

      if (!res.ok) {
        throw new Error("Failed to invite admin");
      }

      const data = await res.json();
      toast.success("Admin invited successfully");
      setShow(false);
      setFormData({
        email: "",
        role: "",
      });
      return data;
    } catch (error) {
      console.log(error);
      toast.error("Failed to invite admin");
    } finally {
      setLoading(false);
    }
  };

  const handleInvite = () => {
    console.log(formData);
    if (
      !formData.email ||
      !formData.email.includes("@") ||
      !formData.email.includes(".")
    )
      return toast.error("Please enter a valid email address");

    inviteAdmin();
  };

  if (!show) return null;

  return (
    <ModalLayout size="2xl">
      <div className="flex flex-col items-center gap-2 w-full py-4">

        <h1 className="font-semibold text-2xl">Invite Admin</h1>

        <p className="font-medium mb-6">
          Create an admin account and assign a role to control access.
        </p>

        <div className="flex flex-col gap-2 w-full">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            placeholder="Enter the invitee's email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            className="input"
          />
        </div>

        <div className="flex flex-col gap-2 w-full">
          <label htmlFor="role">Role</label>
          <select
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            id="role"
            className="input h-12"
          >
            {["admin"].map((role) => (
              <option
                key={role}
                value={role}
                className="text-white bg-secondary-bg"
              >
                {role}
              </option>
            ))}
          </select>

          <p className="font-light text-sm italic">
            Please Note: The selected role determines what this admin can
            access.
          </p>
        </div>

        <div className="flex items-center gap-4 w-full mt-5 font-medium">
          <button
            onClick={() => setShow(false)}
            className="secondary-btn w-full"
          >
            Cancel
          </button>
          <button
            onClick={handleInvite}
            className="primary-btn w-full flex justify-center"
            disabled={loading}
          >
            {loading ? <Loader className="animate-spin" /> : "Invite"}
          </button>
        </div>
      </div>
    </ModalLayout>
  );
};

export default InviteAdmin;
