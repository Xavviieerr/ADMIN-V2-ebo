import { ProfileFeature } from "@/features/profile";
import React from "react";

// const getSuperAdminData = async () => {
//   try {
//     const cookieStore = await cookies();
//     const token = cookieStore.get("accessToken")?.value ?? "";

//     // console.log("===TRIAL===", `${BASE_URL}/admin/super-admin`, token);
//     const res = await fetch(`${BASE_URL}/admin/super-admin`, {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     });
//     if (!res.ok) {
//       console.log("==SUPERADMIN==", await res.json());
//       throw new Error("Failed to fetch super admin data");
//     }
//     const data = await res.json();
//     return data;
//   } catch (error) {
//     return;
//   }
// };

// const getAdminData = async () => {
//   try {
//     const cookieStore = await cookies();
//     const token = cookieStore.get("accessToken")?.value ?? "";
//     const userID = cookieStore.get("userID")?.value ?? "";

//     // console.log("===TRIAL===", `${BASE_URL}/admin/super-admin`, token); 807f5b4a-4928-4713-b72a-b1c8bfb82f5d
//     const res = await fetch(`${BASE_URL}/admin/${userID}`, {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     });
//     if (!res.ok) {
//       console.log(await res.json());
//       throw new Error("Failed to fetch super admin data");
//     }
//     const { data } = await res.json();
//     // console.log(data);
//     return data;
//   } catch (error) {
//     return;
//   }
// };

const ProfilePage = async () => {
  return <ProfileFeature />;
};

export default ProfilePage;
