"use client";
import { Loader } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import ModalLayout from "@/features/shared/modal-layout";
import { getErrorMessage } from "@/utils/errorHandler";
import { useCreateAdminMutation } from "@/slice/requestSlice";
import { createAdminSchema } from "../../schemas/userActions";

const EMPTY_FORM = {
  firstName: "",
  lastName: "",
  username: "",
  email: "",
  password: "",
  gender: "male",
};

const CreateAdmin = ({
  show,
  setShow,
}: {
  show: boolean;
  setShow: (value: boolean) => void;
}) => {
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [fieldError, setFieldError] = useState<string | null>(null);
  const [createAdminMutation, { isLoading }] = useCreateAdminMutation();

  useEffect(() => {
    if (show) {
      setFormData(EMPTY_FORM);
      setFieldError(null);
    }
  }, [show]);

  const handleCreateAdmin = async () => {
    const parsed = createAdminSchema.safeParse(formData);
    if (!parsed.success) {
      const message = parsed.error.issues[0]?.message ?? "Please review the form";
      setFieldError(message);
      return toast.error(message);
    }
    setFieldError(null);
    try {
      await createAdminMutation(parsed.data).unwrap();
      toast.success("Admin created successfully");
      setShow(false);
      setFormData(EMPTY_FORM);
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to create admin"));
    }
  };

  if (!show) return null;

  return (
    <ModalLayout size="2xl">
      <div className="flex flex-col items-center w-full gap-2">
        <h1 className="font-semibold text-2xl">Create Admin</h1>

        <p className="font-medium mb-6">
          Create an admin account and assign a role to control access.
        </p>

        <div className="flex max-md:flex-col items-center md:gap-4 w-full">
          <div className="flex flex-col gap-2 w-full my-2">
            <label htmlFor="firstName">First Name</label>
            <input
              type="text"
              id="firstName"
              placeholder="Enter the admin's first name"
              value={formData.firstName}
              onChange={(e) =>
                setFormData({ ...formData, firstName: e.target.value })
              }
              className="input"
            />
          </div>

          <div className="flex flex-col gap-2 w-full my-2">
            <label htmlFor="lastName">Last Name</label>
            <input
              type="text"
              id="lastName"
              placeholder="Enter the admin's last name"
              value={formData.lastName}
              onChange={(e) =>
                setFormData({ ...formData, lastName: e.target.value })
              }
              className="input"
            />
          </div>
        </div>

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

        <div className="flex max-md:flex-col items-center md:gap-4 w-full">
          <div className="flex flex-col gap-2 w-full my-2">
            <label htmlFor="userName">User Name</label>
            <input
              type="text"
              id="userName"
              placeholder="Enter the admin's user name"
              value={formData.username}
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
              className="input"
            />
          </div>

          <div className="flex flex-col gap-2 w-full">
            <label htmlFor="gender">Gender</label>
            <select
              value={formData.gender}
              onChange={(e) =>
                setFormData({ ...formData, gender: e.target.value })
              }
              id="gender"
              className="input h-12"
            >
              {["male", "female"].map((gender) => (
                <option
                  key={gender}
                  value={gender}
                  className="text-white bg-secondary-bg"
                >
                  {gender}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex flex-col gap-2 w-full my-2">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            placeholder="Enter the admin's password"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
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
            onClick={handleCreateAdmin}
            className="primary-btn w-full flex justify-center"
            disabled={isLoading}
          >
            {isLoading ? <Loader className="animate-spin" /> : "Add Admin"}
          </button>
        </div>
      </div>
    </ModalLayout>
  );
};

export default CreateAdmin;
