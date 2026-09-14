'use client'
import React from 'react'
import { usePermissions } from '@/hooks/usePermissions'
import { useAppSelector } from '@/hooks/redux-hooks'
import { selectCurrentUser } from '@/features/auth/store/authSlice'

export default function PermissionDebug() {
  const { hasPermission, isSuperAdmin, currentUser, permissions, isLoading, error } = usePermissions()
  const reduxUser = useAppSelector(selectCurrentUser)

  return (
    <div className="bg-[#1E1E1E] border border-white/10 rounded-lg p-4 mb-6">
      <h3 className="text-lg font-semibold mb-4 text-[#F5DEB3]">Permission Debug Info</h3>
      
      <div className="space-y-3 text-sm">
        <div>
          <span className="text-gray-400">Redux User:</span>
          <pre className="text-white mt-1 bg-[#2a2a2a] p-2 rounded text-xs overflow-auto">
            {JSON.stringify(reduxUser, null, 2)}
          </pre>
        </div>

        <div>
          <span className="text-gray-400">Current User from usePermissions:</span>
          <pre className="text-white mt-1 bg-[#2a2a2a] p-2 rounded text-xs overflow-auto">
            {JSON.stringify(currentUser, null, 2)}
          </pre>
        </div>

        <div>
          <span className="text-gray-400">Is Super Admin:</span>
          <span className={`ml-2 px-2 py-1 rounded text-xs ${
            isSuperAdmin ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
          }`}>
            {isSuperAdmin ? 'Yes' : 'No'}
          </span>
        </div>

        <div>
          <span className="text-gray-400">Permissions:</span>
          <pre className="text-white mt-1 bg-[#2a2a2a] p-2 rounded text-xs overflow-auto">
            {JSON.stringify(permissions, null, 2)}
          </pre>
        </div>

        <div>
          <span className="text-gray-400">Is Loading:</span>
          <span className={`ml-2 px-2 py-1 rounded text-xs ${
            isLoading ? 'bg-yellow-500/20 text-yellow-400' : 'bg-gray-500/20 text-gray-400'
          }`}>
            {isLoading ? 'Yes' : 'No'}
          </span>
        </div>

        <div>
          <span className="text-gray-400">Error:</span>
          <span className={`ml-2 px-2 py-1 rounded text-xs ${
            error ? 'bg-red-500/20 text-red-400' : 'bg-gray-500/20 text-gray-400'
          }`}>
            {error ? 'Yes' : 'No'}
          </span>
        </div>

        <div className="mt-4">
          <span className="text-gray-400">Permission Tests:</span>
          <div className="mt-2 space-y-1">
            {['add_word', 'moderate_word', 'edit_word', 'view_province'].map(permission => (
              <div key={permission} className="flex items-center gap-2">
                <span className="text-gray-300 text-xs">{permission}:</span>
                <span className={`px-2 py-1 rounded text-xs ${
                  hasPermission(permission) ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                }`}>
                  {hasPermission(permission) ? 'Yes' : 'No'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
