"use client";
import { UserData } from "@/features/shared";
import React from "react";
import UserProfile from "./components/user-profile";
import { useSearchParams } from "next/navigation";

const UserBody = ({ userData }: { userData: UserData }) => {
  const searchParams = useSearchParams();
  const isContributor = searchParams.get("role") === "contributor";

  if (isContributor) return null;
  return <UserProfile userData={userData} />;
};

export default UserBody;
