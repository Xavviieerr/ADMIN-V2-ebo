"use client";

import { useEffect, useState, type SetStateAction } from "react";
import { toast } from "sonner";
import {
  useGetAllAdminPermissionsQuery,
  useGetSingleAdminPermissionQuery,
  useGetSingleAdminUserQuery,
  useGetSingleUserQuery,
  useSetAdminPermissionMutation,
} from "@/slice/requestSlice";
import { PERMISSION_MAPPING, convertToApiName } from "@/types/permissions";
import { getErrorMessage } from "@/utils/errorHandler";
import type {
  SingleAdminUserResponse,
  SingleUserResponse,
} from "@/types/userTypes";

export interface CategoryPermission {
  uiName: string;
  title: string;
  description: string;
}

/**
 * Shared permission-editing state for the admin / contributor
 * permission screens: user resolution, permission map, optimistic
 * toggles with revert-on-failure, and save + refetch.
 */
export function usePermissionEditor(userId: string) {
  const [permissions, setPermissions] = useState<Record<string, boolean>>({});

  const { data: singleUser, isLoading: isLoadingUser } =
    useGetSingleUserQuery({ id: userId });
  const { data: singleAdminUser, isLoading: isLoadingAdmin } =
    useGetSingleAdminUserQuery({ id: userId });
  const { data: allPermissions, isLoading: isLoadingPermissions } =
    useGetAllAdminPermissionsQuery();
  const {
    data: userPermissions,
    isLoading: isLoadingUserPermissions,
    isError: isPermissionsError,
    refetch: refetchUserPermissions,
  } = useGetSingleAdminPermissionQuery({ id: userId });
  const [setPermission] = useSetAdminPermissionMutation();

  const adminData = (singleAdminUser as SingleAdminUserResponse | undefined)
    ?.data;
  const userData = (singleUser as SingleUserResponse | undefined)?.data;
  const isAdmin = Boolean(adminData);
  const user = adminData?.user ?? userData ?? null;

  const isLoading =
    isLoadingUser ||
    isLoadingAdmin ||
    isLoadingPermissions ||
    isLoadingUserPermissions;

  useEffect(() => {
    if (userPermissions?.data) {
      setPermissions(userPermissions.data);
    }
  }, [userPermissions]);

  const getPermissionsByCategory = (category: string): CategoryPermission[] => {
    if (!allPermissions?.data) return [];

    return Object.entries(PERMISSION_MAPPING)
      .filter(([, mapping]) => mapping.category === category)
      .map(([uiName, mapping]) => ({
        uiName,
        title: mapping.title,
        description: mapping.description,
      }));
  };

  const persistPermissions = async (
    updatedPermissions: Record<string, boolean>,
    method: "POST" | "PATCH",
    successMessage: string,
  ) => {
    const apiPermissions: Record<string, boolean> = {};
    Object.keys(updatedPermissions).forEach((uiName) => {
      const apiName = convertToApiName(uiName);
      apiPermissions[apiName] = updatedPermissions[uiName];
    });

    await setPermission({
      permissions: apiPermissions,
      userId,
      method,
    }).unwrap();

    await refetchUserPermissions();
    toast.success(successMessage);
  };

  /**
   * Shared optimistic-update core for both toggle paths: persist the
   * given permission map, and on failure revert state, toast the
   * backend message, and rethrow so callers can react.
   */
  const runToggle = async (
    updatedPermissions: Record<string, boolean>,
    method: "POST" | "PATCH",
    successMessage: string,
    revert: SetStateAction<Record<string, boolean>>,
    failureMessage: string,
  ) => {
    try {
      await persistPermissions(updatedPermissions, method, successMessage);
    } catch (error) {
      setPermissions(revert);
      toast.error(getErrorMessage(error, failureMessage));
      throw error;
    }
  };

  const togglePermission = async (permissionKey: string) => {
    const newValue = !permissions[permissionKey];

    setPermissions((prev) => ({
      ...prev,
      [permissionKey]: newValue,
    }));

    const userPermissionData = userPermissions?.data || {};
    const permissionExists = Object.prototype.hasOwnProperty.call(
      userPermissionData,
      permissionKey,
    );

    return runToggle(
      {
        ...permissions,
        [permissionKey]: newValue,
      },
      permissionExists ? "PATCH" : "POST",
      `Permission ${newValue ? "enabled" : "disabled"} successfully`,
      (prev) => ({ ...prev, [permissionKey]: !newValue }),
      "Failed to update permission",
    );
  };

  const toggleAllCategoryPermissions = async (category: string) => {
    const categoryPermissions = getPermissionsByCategory(category);
    const allEnabled = categoryPermissions.every(
      (permission) => permissions[permission.uiName],
    );
    const newValue = !allEnabled;

    const previousPermissions = { ...permissions };
    const updatedPermissions = { ...permissions };
    categoryPermissions.forEach((permission) => {
      updatedPermissions[permission.uiName] = newValue;
    });
    setPermissions(updatedPermissions);

    return runToggle(
      updatedPermissions,
      "PATCH",
      `All ${category} permissions ${newValue ? "enabled" : "disabled"} successfully`,
      previousPermissions,
      "Failed to update permissions",
    );
  };

  return {
    user,
    isAdmin,
    isLoading,
    isError: isPermissionsError,
    refetch: refetchUserPermissions,
    permissions,
    getPermissionsByCategory,
    togglePermission,
    toggleAllCategoryPermissions,
  };
}
