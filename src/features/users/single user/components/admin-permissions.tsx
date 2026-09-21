import {
  useGetAllAdminPermissionsQuery,
  useGetSingleAdminPermissionQuery,
  useGetSingleAdminUserQuery,
  useGetSingleUserQuery,
  useSetAdminPermissionMutation,
} from "@/slice/requestSlice";
import { PERMISSION_MAPPING, convertToApiName } from "@/types/permissions";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { getErrorMessage } from "@/utils/errorHandler";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

const AdminPermissions = ({ userId }: { userId: string }) => {
  // State for permissions - using API permission names
  const [permissions, setPermissions] = useState<Record<string, boolean>>({});

  // API calls
  const { data: singleUser, isLoading: isLoadingUser } = useGetSingleUserQuery({
    id: userId,
  });
  const { data: singleAdminUser, isLoading: isLoadingAdmin } =
    useGetSingleAdminUserQuery({ id: userId });
  const { data: allPermissions, isLoading: isLoadingPermissions } =
    useGetAllAdminPermissionsQuery();
  const {
    data: userPermissions,
    isLoading: isLoadingUserPermissions,
    refetch: refetchUserPermissions,
  } = useGetSingleAdminPermissionQuery({ id: userId });
  const [setPermission] = useSetAdminPermissionMutation();

  // Determine if this is an admin user (check if admin data exists)
  const isAdmin = singleAdminUser !== undefined;
  const user = isAdmin
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ? (singleAdminUser as any)?.data?.user
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    : (singleUser as any)?.data;
  const isLoading =
    isLoadingUser ||
    isLoadingAdmin ||
    isLoadingPermissions ||
    isLoadingUserPermissions;

  // Initialize permissions when data is loaded
  useEffect(() => {
    if (userPermissions?.data) {
      setPermissions(userPermissions.data);
    }
  }, [userPermissions]);

  // Helper function to get permissions by category
  const getPermissionsByCategory = (category: string) => {
    if (!allPermissions?.data) return [];

    return Object.entries(PERMISSION_MAPPING)
      .filter(([, mapping]) => mapping.category === category)
      .map(([uiName, mapping]) => ({
        uiName,
        mapping,
        apiName: convertToApiName(uiName),
      }));
  };

  // Permission toggle handlers
  const togglePermission = async (permissionKey: string) => {
    const newValue = !permissions[permissionKey];

    // Update local state immediately for better UX
    setPermissions((prev) => ({
      ...prev,
      [permissionKey]: newValue,
    }));

    try {
      // Check if this specific permission already exists in user's permissions
      const userPermissionData = userPermissions?.data || {};
      const permissionExists = userPermissionData.hasOwnProperty(permissionKey);

      // Create the permissions object for the API
      const updatedPermissions = {
        ...permissions,
        [permissionKey]: newValue,
      };

      // Convert UI permission names to API format for the request (use underscores)
      const apiPermissions: Record<string, boolean> = {};
      Object.keys(updatedPermissions).forEach((uiName) => {
        const apiName = convertToApiName(uiName); // This keeps _ as _
        apiPermissions[apiName] = updatedPermissions[uiName];
      });

      // Use PATCH if permission exists, POST if it doesn't
      const method: "POST" | "PATCH" = permissionExists ? "PATCH" : "POST";

      await setPermission({
        permissions: apiPermissions,
        userId: userId,
        method: method,
      }).unwrap();

      // Refetch the latest permissions from the server
      await refetchUserPermissions();

      toast.success(
        `Permission ${newValue ? "enabled" : "disabled"} successfully`,
      );
    } catch (error) {
      console.error("Error updating permission:", error);
      // Revert the local state on error
      setPermissions((prev) => ({
        ...prev,
        [permissionKey]: !newValue,
      }));
      toast.error(getErrorMessage(error, "Failed to update permission"));
    }
  };

  const toggleAllCategoryPermissions = async (category: string) => {
    const categoryPermissions = getPermissionsByCategory(category);
    const allEnabled = categoryPermissions.every(
      (permission) => permissions[permission.uiName],
    );
    const newValue = !allEnabled;

    // Update local state immediately
    const updatedPermissions = { ...permissions };
    categoryPermissions.forEach((permission) => {
      updatedPermissions[permission.uiName] = newValue;
    });
    setPermissions(updatedPermissions);

    try {
      // Convert to API format
      const apiPermissions: Record<string, boolean> = {};
      Object.keys(updatedPermissions).forEach((uiName) => {
        const apiName = convertToApiName(uiName);
        apiPermissions[apiName] = updatedPermissions[uiName];
      });

      await setPermission({
        permissions: apiPermissions,
        userId: userId,
        method: "PATCH",
      }).unwrap();

      // Refetch the latest permissions from the server
      await refetchUserPermissions();

      toast.success(
        `All ${category} permissions ${newValue ? "enabled" : "disabled"} successfully`,
      );
    } catch (error) {
      console.error("Error updating permissions:", error);
      // Revert on error
      setPermissions(permissions);
      toast.error(getErrorMessage(error, "Failed to update permissions"));
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen p-4 md:p-6 bg-[#1F1F27] flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen p-4 md:p-6 bg-[#1F1F27] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-white mb-2">
            User not found
          </h2>
          <p className="text-gray-400">
            The user you&apos;re looking for doesn&apos;t exist.
          </p>
        </div>
      </div>
    );
  }
  return (
    <div className="flex flex-col w-full dark-box max-md:mt-10 item-start gap-5">
      <div className="flex flex-col gap-2 lg:mb-5">
        <h2 className="text-lg font-semibold text-white">
          All Permissions
        </h2>
        <p className="text-gray-txt-50 max-md:text-sm">
          View all available permissions and their descriptions
        </p>
      </div>

      {/* Permissions Section */}
      <div className="flex max-w-full w-full max-md:flex-col lg:overflow-x-scroll no-scrollbar gap-4">
        {/* User Management */}
        <div className="bg-[#1E1E1E] rounded-xl py-6 px-4 md:p-6 border border-gray-700 lg:w-1/3 w-full shrink-0">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg max-md:text-base font-semibold text-white">
              User Management
            </h3>
            <button
              onClick={() => toggleAllCategoryPermissions("user")}
              className="text-sm text-gray-400 hover:text-secondary-bg hover:bg-foreground rounded cursor-pointer transition-all px-5 h-auto p-0"
            >
              Enable all
            </button>
          </div>

          <div className="space-y-4">
            {getPermissionsByCategory("user").map((permission) => (
              <PermissionItem
                key={permission.uiName}
                title={permission.mapping.title}
                description={permission.mapping.description}
                enabled={permissions[permission.uiName] || false}
                onToggle={() => togglePermission(permission.uiName)}
              />
            ))}
          </div>
        </div>

        {/* Province Management */}
        <div className="bg-[#1E1E1E] rounded-xl py-6 px-4 md:p-6 border border-gray-700 lg:w-1/3 w-full shrink-0">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg max-md:text-base font-semibold text-white">
              Province Management
            </h3>
            <button
              onClick={() => toggleAllCategoryPermissions("province")}
              className="text-sm text-gray-400 hover:text-secondary-bg hover:bg-foreground rounded cursor-pointer transition-all px-5 h-auto p-0"
            >
              Enable all
            </button>
          </div>
          <div className="space-y-4">
            {getPermissionsByCategory("province").map((permission) => (
              <PermissionItem
                key={permission.uiName}
                title={permission.mapping.title}
                description={permission.mapping.description}
                enabled={permissions[permission.uiName] || false}
                onToggle={() => togglePermission(permission.uiName)}
              />
            ))}
          </div>
        </div>

        {/* Dictionary Management */}
        <div className="bg-[#1E1E1E] rounded-xl py-6 px-4 md:p-6 border border-gray-700 lg:w-1/3 w-full shrink-0">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg max-md:text-base font-semibold text-white">
              Dictionary Management
            </h3>
            <button
              onClick={() => toggleAllCategoryPermissions("dictionary")}
              className="text-sm text-gray-400 hover:text-secondary-bg hover:bg-foreground rounded cursor-pointer transition-all px-5 h-auto p-0"
            >
              Enable all
            </button>
          </div>
          <div className="space-y-4">
            {getPermissionsByCategory("dictionary").map((permission) => (
              <PermissionItem
                key={permission.uiName}
                title={permission.mapping.title}
                description={permission.mapping.description}
                enabled={permissions[permission.uiName] || false}
                onToggle={() => togglePermission(permission.uiName)}
              />
            ))}
          </div>
        </div>

        {/* Sports Management */}
        {/* <div className="bg-[#1E1E1E] rounded-xl p-6 border border-gray-700 lg:w-1/3 w-full shrink-0">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg max-md:text-base font-semibold text-white">
              Sports Management
            </h3>
            <button
              onClick={() => toggleAllCategoryPermissions("admin")}
              className="text-sm text-gray-400 hover:text-secondary-bg hover:bg-foreground rounded cursor-pointer transition-all px-5 h-auto p-0"
            >
              Enable all
            </button>
          </div>
          <div className="space-y-4">
            {getPermissionsByCategory("user").map((permission) => (
              <PermissionItem
                key={permission.uiName}
                title={permission.mapping.title}
                description={permission.mapping.description}
                enabled={permissions[permission.uiName] || false}
                onToggle={() => togglePermission(permission.uiName)}
              />
            ))}
          </div>
        </div> */}

        {/* Guonopedia Management */}
        {/* <div className="bg-[#1E1E1E] rounded-xl p-6 border border-gray-700 lg:w-1/3 w-full shrink-0">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg max-md:text-base font-semibold text-white">
              Guonopedia Management
            </h3>
            <button
              onClick={() => toggleAllCategoryPermissions("admin")}
              className="text-sm text-gray-400 hover:text-secondary-bg hover:bg-foreground rounded cursor-pointer transition-all px-5 h-auto p-0"
            >
              Enable all
            </button>
          </div>
          <div className="space-y-4">
            {getPermissionsByCategory("user").map((permission) => (
              <PermissionItem
                key={permission.uiName}
                title={permission.mapping.title}
                description={permission.mapping.description}
                enabled={permissions[permission.uiName] || false}
                onToggle={() => togglePermission(permission.uiName)}
              />
            ))}
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default AdminPermissions;

const PermissionItem = ({
  title,
  description,
  enabled = false,
  onToggle,
}: {
  title: string;
  description: string;
  enabled?: boolean;
  onToggle?: () => void;
}) => {
  return (
    <div className="flex items-start justify-between p-4 bg-[#2a2a2a] rounded-lg border border-gray-600">
      <div className="flex-1">
        <h4 className="text-white font-medium text-sm mb-1">{title}</h4>
        <p className="text-gray-400 text-xs">{description}</p>
      </div>
      <button
        onClick={onToggle}
        type="button"
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${enabled ? "bg-[#33B9C8]" : "bg-gray-600"
          }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${enabled ? "translate-x-6" : "translate-x-1"
            }`}
        />
      </button>
    </div>
  );
};
