'use client'

import { useGetSingleUserQuery, useGetSingleAdminUserQuery, useGetAllAdminPermissionsQuery, useGetSingleAdminPermissionQuery, useSetAdminPermissionMutation } from '@/slice/requestSlice';
import { use, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner'
import { getErrorMessage } from "@/utils/errorHandler";
import { ArrowLeft, Settings } from 'lucide-react';
import { PERMISSION_MAPPING, convertToApiName } from '@/types/permissions';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { Button } from '@/components/ui/button';

// Permission Item Component
const PermissionItem = ({ 
  title, 
  description, 
  enabled = false, 
  onToggle 
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
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
          enabled ? 'bg-red-600' : 'bg-gray-600'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            enabled ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );
};

export default function UserPermissionsPage({ params }: { params: Promise<{ userId: string }> }) {
  const { userId } = use(params);
  const router = useRouter();
  
  // State for permissions - using API permission names
  const [permissions, setPermissions] = useState<Record<string, boolean>>({});
  
  // API calls
  const { data: singleUser, isLoading: isLoadingUser } = useGetSingleUserQuery({ id: userId });
  const { data: singleAdminUser, isLoading: isLoadingAdmin } = useGetSingleAdminUserQuery({ id: userId });
  const { data: allPermissions, isLoading: isLoadingPermissions } = useGetAllAdminPermissionsQuery();
  const { data: userPermissions, isLoading: isLoadingUserPermissions, refetch: refetchUserPermissions } = useGetSingleAdminPermissionQuery({ id: userId });
  const [setPermission, ] = useSetAdminPermissionMutation();
  
  // Determine if this is an admin user (check if admin data exists)
  const isAdmin = singleAdminUser !== undefined;
  const user = isAdmin ? (singleAdminUser as any)?.data?.user : (singleUser as any)?.data;
  const isLoading = isLoadingUser || isLoadingAdmin || isLoadingPermissions || isLoadingUserPermissions;
  
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
      .filter(([_, mapping]) => mapping.category === category)
      .map(([uiName, mapping]) => ({
        uiName,
        mapping,
        apiName: convertToApiName(uiName)
      }));
  };

  // Permission toggle handlers
  const togglePermission = async (permissionKey: string) => {
    const newValue = !permissions[permissionKey];
    
    // Update local state immediately for better UX
    setPermissions(prev => ({
      ...prev,
      [permissionKey]: newValue
    }));

    try {
      // Check if this specific permission already exists in user's permissions
      const userPermissionData = userPermissions?.data || {};
      const permissionExists = userPermissionData.hasOwnProperty(permissionKey);
      
      // Create the permissions object for the API
      const updatedPermissions = {
        ...permissions,
        [permissionKey]: newValue
      };

      // Convert UI permission names to API format for the request (use underscores)
      const apiPermissions: Record<string, boolean> = {};
      Object.keys(updatedPermissions).forEach(uiName => {
        const apiName = convertToApiName(uiName); // This keeps _ as _
        apiPermissions[apiName] = updatedPermissions[uiName];
      });

      // Use PATCH if permission exists, POST if it doesn't
      const method: 'POST' | 'PATCH' = permissionExists ? 'PATCH' : 'POST';
      
      await setPermission({
        permissions: apiPermissions,
        userId: userId,
        method: method
      }).unwrap();

      // Refetch the latest permissions from the server
      await refetchUserPermissions();

      toast.success(`Permission ${newValue ? 'enabled' : 'disabled'} successfully`);
    } catch (error) {
      console.error('Error updating permission:', error);
      // Revert the local state on error
      setPermissions(prev => ({
        ...prev,
        [permissionKey]: !newValue
      }));
      toast.error(getErrorMessage(error, "Failed to update permission"));
    }
  };

  const toggleAllCategoryPermissions = async (category: string) => {
    const categoryPermissions = getPermissionsByCategory(category);
    const allEnabled = categoryPermissions.every(permission => permissions[permission.uiName]);
    const newValue = !allEnabled;

    // Update local state immediately
    const updatedPermissions = { ...permissions };
    categoryPermissions.forEach(permission => {
      updatedPermissions[permission.uiName] = newValue;
    });
    setPermissions(updatedPermissions);

    try {
      // Convert to API format
      const apiPermissions: Record<string, boolean> = {};
      Object.keys(updatedPermissions).forEach(uiName => {
        const apiName = convertToApiName(uiName);
        apiPermissions[apiName] = updatedPermissions[uiName];
      });

      await setPermission({
        permissions: apiPermissions,
        userId: userId,
        method: 'PATCH'
      }).unwrap();

      // Refetch the latest permissions from the server
      await refetchUserPermissions();

      toast.success(`All ${category} permissions ${newValue ? 'enabled' : 'disabled'} successfully`);
    } catch (error) {
      console.error('Error updating permissions:', error);
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
          <h2 className="text-xl font-semibold text-white mb-2">User not found</h2>
          <p className="text-gray-400">The user you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-6 bg-[#1F1F27] text-white">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-400 hover:text-white"
          >
            <ArrowLeft className="h-5 w-5" />
            Back
          </Button>
        </div>
        
        <div className="flex items-center gap-4 mb-2">
          <Settings className="h-8 w-8 text-red-500" />
          <h1 className="text-2xl md:text-3xl font-bold text-white">
            Manage Permissions
          </h1>
        </div>
        
        <div className="flex items-center gap-4">
          <img
            src={user?.profilePictureUrl || '/default_avatar.svg'}
            alt={`${user?.firstName} ${user?.lastName}`}
            className="h-12 w-12 rounded-full object-cover border-2 border-[#404040]"
          />
          <div>
            <h2 className="text-lg font-semibold text-white">
              {user?.firstName} {user?.lastName}
            </h2>
            <p className="text-gray-400">@{user?.username} • {user?.role?.replace(/_/g, " ")}</p>
          </div>
        </div>
      </div>

      {/* Permissions Section */}
      <div className="space-y-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* User Management */}
        <div className="bg-[#1E1E1E] rounded-xl p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white">User Management</h3>
            <Button 
              variant="ghost"
              onClick={() => toggleAllCategoryPermissions('user')}
              className="text-sm text-gray-400 hover:text-white h-auto p-0"
            >
              Enable all
            </Button>
          </div>
          <div className="space-y-4">
            {getPermissionsByCategory('user').map((permission) => (
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
        <div className="bg-[#1E1E1E] rounded-xl p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white">Province Management</h3>
            <Button 
              variant="ghost"
              onClick={() => toggleAllCategoryPermissions('province')}
              className="text-sm text-gray-400 hover:text-white h-auto p-0"
            >
              Enable all
            </Button>
          </div>
          <div className="space-y-4">
            {getPermissionsByCategory('province').map((permission) => (
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
        <div className="bg-[#1E1E1E] rounded-xl p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white">Dictionary Management</h3>
            <Button 
              variant="ghost"
              onClick={() => toggleAllCategoryPermissions('dictionary')}
              className="text-sm text-gray-400 hover:text-white h-auto p-0"
            >
              Enable all
            </Button>
          </div>
          <div className="space-y-4">
            {getPermissionsByCategory('dictionary').map((permission) => (
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

        {/* Admin Management */}
        <div className="bg-[#1E1E1E] rounded-xl p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white">Admin Management</h3>
            <Button 
              variant="ghost"
              onClick={() => toggleAllCategoryPermissions('admin')}
              className="text-sm text-gray-400 hover:text-white h-auto p-0"
            >
              Enable all
            </Button>
          </div>
          <div className="space-y-4">
            {getPermissionsByCategory('admin').map((permission) => (
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
      </div>
    </div>
  );
}
