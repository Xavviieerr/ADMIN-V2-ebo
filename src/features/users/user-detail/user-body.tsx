"use client";
import type { UserData, Contributor } from "../types";
import React from "react";
import UserProfile from "./components/user-profile";
import { useSearchParams } from "next/navigation";

const UserBody = ({
  userData,
  contributor,
}: {
  userData: UserData;
  contributor?: Contributor;
}) => {
  const searchParams = useSearchParams();
  const isContributor = searchParams.get("role") === "contributor";

  if (isContributor) return null;
  return <UserProfile userData={userData} contributor={contributor} />;
};

export default UserBody;
