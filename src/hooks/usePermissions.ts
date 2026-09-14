import { useSelector } from 'react-redux';
import { useEffect, useRef } from 'react';
import { useGetSingleAdminPermissionQuery } from '@/slice/requestSlice';
import { selectCurrentUser } from '@/features/auth/store/authSlice';

export const usePermissions = () => {
  const currentUser = useSelector(selectCurrentUser);
  const isSuperAdmin = currentUser?.role === 'super_admin';
  const previousUserIdRef = useRef<string | undefined>(undefined);
  
  // Only fetch permissions if user is not super admin
  const { data: userPermissions, isLoading, error, refetch } = useGetSingleAdminPermissionQuery(
    { id: currentUser?.id || '' },
    { skip: !currentUser?.id || isSuperAdmin }
  );

  // Refetch permissions when user ID becomes available (e.g., after login)
  // This ensures permissions are loaded immediately after login without requiring a page refresh
  useEffect(() => {
    const currentUserId = currentUser?.id;
    const previousUserId = previousUserIdRef.current;
    
    if (
      currentUserId && 
      !previousUserId && 
      !isSuperAdmin && 
      !isLoading
    ) {
      refetch();
    }
    
    // Update the ref to track the previous user ID
    previousUserIdRef.current = currentUserId;
  }, [currentUser?.id, isSuperAdmin, refetch, isLoading]);

  const permissions = userPermissions?.data || {};

  // Helper function to check if user has a specific permission
  const hasPermission = (permission: string): boolean => {
    if (isSuperAdmin) return true; // Super admin has all permissions
    return permissions[permission] === true;
  };

  // Helper function to check if user has any of the given permissions
  const hasAnyPermission = (permissionList: string[]): boolean => {
    if (isSuperAdmin) return true;
    return permissionList.some(permission => permissions[permission] === true);
  };

  // Helper function to check if user has all of the given permissions
  const hasAllPermissions = (permissionList: string[]): boolean => {
    if (isSuperAdmin) return true;
    return permissionList.every(permission => permissions[permission] === true);
  };

  return {
    permissions,
    isLoading,
    error,
    isSuperAdmin,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    currentUser
  };
};
