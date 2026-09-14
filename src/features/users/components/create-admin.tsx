"use client";
import { BASE_URL } from "@/utils/constants";
import { Loader } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { getAccessToken } from "@/features/auth/utils/tokenStorage";
import ModalLayout from "@/features/shared/modal-layout";

const CreateAdmin = ({
  show,
  setShow,
}: {
  show: boolean;
  setShow: (value: boolean) => void;
}) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    gender: "male",
  });
  const [loading, setLoading] = useState(false);
  const token = getAccessToken();

  const createAdmin = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/admin/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        throw new Error("Failed to create admin");
      }

      const data = await res.json();
      toast.success("Admin created successfully");
      setShow(false);
      setFormData({
        firstName: "",
        lastName: "",
        username: "",
        email: "",
        password: "",
        gender: "",
      });
      return data;
    } catch (error) {
      console.log(error);
      toast.error("Failed to create admin");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAdmin = () => {
    if (!formData.firstName.trim())
      return toast.error("Please enter the first name");
    if (!formData.lastName.trim())
      return toast.error("Please enter the last name");
    if (!formData.username.trim())
      return toast.error("Please enter the user name");
    if (!formData.gender.trim()) return toast.error("Please select the gender");
    if (
      !formData.email.trim() ||
      !formData.email.includes("@") ||
      !formData.email.includes(".")
    )
      return toast.error("Please enter a valid email address");

    createAdmin();
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

        <div className="flex items-center gap-4 w-full mt-5 font-medium">
          <button
            onClick={() => setShow(false)}
            className="secondary-btn w-full"
          >
            Cancel
          </button>
          <button
            onClick={handleCreateAdmin}
            className="primary-btn w-full flex justify-center"
            disabled={loading}
          >
            {loading ? <Loader className="animate-spin" /> : "Add Admin"}
          </button>
        </div>
      </div>
    </ModalLayout>
  );
};

export default CreateAdmin;
