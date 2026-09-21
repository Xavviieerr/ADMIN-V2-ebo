'use client'

import { useGetAllAdminPermissionsQuery } from '@/slice/requestSlice';
import { PERMISSION_MAPPING } from '@/types/permissions';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { Settings } from 'lucide-react';
import { usePermissions } from '@/hooks/usePermissions';
import { useRouter } from 'next/navigation';

export default function PermissionsPage() {
  const { data: allPermissions, isLoading } = useGetAllAdminPermissionsQuery();
  const { isSuperAdmin } = usePermissions();
  const router = useRouter();

  // Redirect if not super admin
  if (!isSuperAdmin) {
    router.push('/home');
    return null;
  }

  // Helper function to get permissions by category
  const getPermissionsByCategory = (category: string) => {
    if (!allPermissions?.data) return [];

    return Object.entries(PERMISSION_MAPPING)
      .filter(([, mapping]) => mapping.category === category)
      .map(([uiName, mapping]) => ({
        uiName,
        mapping,
      }));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen p-4 md:p-6 bg-[#18191f] flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen p-3 sm:p-4 md:p-6 lg:p-8 bg-[#18191f] text-white">
      {/* Header */}
      <div className="mb-6 sm:mb-8 mt-4 sm:mt-5">
        <div className="flex items-center gap-4 mb-2">
          <Settings className="h-6 w-6 sm:h-8 sm:w-8 text-foreground" />
          <h1 className="text-xl sm:text-2xl font-semibold text-white">All Permissions</h1>
        </div>
        <p className="text-sm sm:text-base text-gray-400 mt-2">
          View all available permissions and their descriptions
        </p>
      </div>

      {/* Permissions Section */}
      <div className="space-y-6 sm:space-y-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* User Management */}
        <div className="bg-[#1E1E1E] rounded-lg sm:rounded-xl p-4 sm:p-6 border border-white/10">
          <div className="mb-4 sm:mb-6">
            <h3 className="text-base sm:text-lg font-semibold text-white">User Management</h3>
          </div>
          <div className="space-y-3 sm:space-y-4">
            {getPermissionsByCategory('user').map((permission) => (
              <div key={permission.uiName} className="p-3 sm:p-4 bg-[#2a2a2a] rounded-lg border border-white/10">
                <h4 className="text-sm sm:text-base text-white font-medium mb-1 sm:mb-2">
                  {permission.mapping.title}
                </h4>
                <p className="text-xs sm:text-sm text-gray-400">{permission.mapping.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Province Management */}
        <div className="bg-[#1E1E1E] rounded-lg sm:rounded-xl p-4 sm:p-6 border border-white/10">
          <div className="mb-4 sm:mb-6">
            <h3 className="text-base sm:text-lg font-semibold text-white">Province Management</h3>
          </div>
          <div className="space-y-3 sm:space-y-4">
            {getPermissionsByCategory('province').map((permission) => (
              <div key={permission.uiName} className="p-3 sm:p-4 bg-[#2a2a2a] rounded-lg border border-white/10">
                <h4 className="text-sm sm:text-base text-white font-medium mb-1 sm:mb-2">
                  {permission.mapping.title}
                </h4>
                <p className="text-xs sm:text-sm text-gray-400">{permission.mapping.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Dictionary Management */}
        <div className="bg-[#1E1E1E] rounded-lg sm:rounded-xl p-4 sm:p-6 border border-white/10">
          <div className="mb-4 sm:mb-6">
            <h3 className="text-base sm:text-lg font-semibold text-white">Dictionary Management</h3>
          </div>
          <div className="space-y-3 sm:space-y-4">
            {getPermissionsByCategory('dictionary').map((permission) => (
              <div key={permission.uiName} className="p-3 sm:p-4 bg-[#2a2a2a] rounded-lg border border-white/10">
                <h4 className="text-sm sm:text-base text-white font-medium mb-1 sm:mb-2">
                  {permission.mapping.title}
                </h4>
                <p className="text-xs sm:text-sm text-gray-400">{permission.mapping.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Town Management */}
        {getPermissionsByCategory('town').length > 0 && (
          <div className="bg-[#1E1E1E] rounded-lg sm:rounded-xl p-4 sm:p-6 border border-white/10">
            <div className="mb-4 sm:mb-6">
              <h3 className="text-base sm:text-lg font-semibold text-white">Town Management</h3>
            </div>
            <div className="space-y-3 sm:space-y-4">
              {getPermissionsByCategory('town').map((permission) => (
                <div key={permission.uiName} className="p-3 sm:p-4 bg-[#2a2a2a] rounded-lg border border-white/10">
                  <h4 className="text-sm sm:text-base text-white font-medium mb-1 sm:mb-2">
                    {permission.mapping.title}
                  </h4>
                  <p className="text-xs sm:text-sm text-gray-400">{permission.mapping.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

