'use client'

import React, { useState, useEffect } from 'react'
import AddProvince from './addProvince'
import { useGetAllProvincesQuery } from '@/slice/requestSlice'
import { Province } from '@/types/provinceTypes'
import LoadingSpinner from '../ui/LoadingSpinner'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { EyeIcon } from 'lucide-react'
import { useRouter, usePathname } from 'next/navigation'
import { usePermissions } from '@/hooks/usePermissions'
import { Button } from '@/components/ui/button'

const STORAGE_KEY_PROVINCES_PAGE = 'provinces_page'

// Helper function to generate page numbers for pagination
const getPageNumbers = (currentPage: number, totalPages: number): (number | string)[] => {
  const pages: (number | string)[] = []
  const maxVisible = 4 // Maximum number of page buttons to show

  if (totalPages <= maxVisible) {
    // Show all pages if total is less than max visible
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i)
    }
  } else {
    // Always show first page
    pages.push(1)

    if (currentPage <= 3) {
      // Near the beginning
      for (let i = 2; i <= 4; i++) {
        pages.push(i)
      }
      pages.push('...')
      pages.push(totalPages)
    } else if (currentPage >= totalPages - 2) {
      // Near the end
      pages.push('...')
      for (let i = totalPages - 3; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      // In the middle
      pages.push('...')
      for (let i = currentPage - 1; i <= currentPage + 1; i++) {
        pages.push(i)
      }
      pages.push('...')
      pages.push(totalPages)
    }
  }

  return pages
}

export default function ProvinceOverview() {
  const [isAddProvinceOpen, setIsAddProvinceOpen] = useState(false)

  // Initialize page from localStorage
  const [page, setPage] = useState(() => {
    if (typeof window !== 'undefined') {
      const storedPage = localStorage.getItem(STORAGE_KEY_PROVINCES_PAGE)
      if (storedPage) {
        const pageNum = parseInt(storedPage, 10)
        if (!isNaN(pageNum) && pageNum > 0) {
          return pageNum
        }
      }
    }
    return 1
  })

  const pathname = usePathname()

  // When navigating to province: reset pagination if sidebar "Province" was clicked, otherwise restore from localStorage (e.g. back from single province)
  useEffect(() => {
    if (pathname === '/province' && typeof window !== 'undefined') {
      const clearPaginationFlag = sessionStorage.getItem('province-clear-pagination')
      if (clearPaginationFlag === '1') {
        sessionStorage.removeItem('province-clear-pagination')
        setPage(1)
        localStorage.setItem(STORAGE_KEY_PROVINCES_PAGE, '1')
      } else {
        // Restore page from localStorage when coming back (e.g. from single province)
        const storedPage = localStorage.getItem(STORAGE_KEY_PROVINCES_PAGE)
        if (storedPage) {
          const pageNum = parseInt(storedPage, 10)
          if (!isNaN(pageNum) && pageNum > 0) {
            setPage(pageNum)
          }
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  // Listen for nav click events: when Province tab is clicked in sidebar, reset pagination (even if already on that page)
  useEffect(() => {
    const handleNavClick = (event: CustomEvent) => {
      const clickedHref = event.detail?.href
      if (clickedHref === '/province') {
        setPage(1)
        if (typeof window !== 'undefined') {
          localStorage.setItem(STORAGE_KEY_PROVINCES_PAGE, '1')
        }
      }
    }

    window.addEventListener('nav-click', handleNavClick as EventListener)
    return () => {
      window.removeEventListener('nav-click', handleNavClick as EventListener)
    }
  }, [])
  
  // Save page to localStorage when it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY_PROVINCES_PAGE, page.toString())
    }
  }, [page])

  // Fetch provinces with pagination
  const { data, isLoading, isError, error } = useGetAllProvincesQuery({ page, limit: 6 })

  const router = useRouter()
  const { hasPermission, isSuperAdmin } = usePermissions()

  // Extract provinces and pagination safely
  const provinces: Province[] = data?.data?.data ?? []
  const pagination = data?.data?.pagination

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-red-400 text-center">
          <p className="text-lg font-medium">Error loading provinces</p>
          <p className="text-sm text-gray-400 mt-2">
            {error && 'data' in error ? String(error.data) : 'An error occurred'}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6 flex-wrap">
        <h1 className="text-2xl font-semibold text-white mt-10 md:mt-0">Provinces Overview</h1>
        <div className="flex gap-3  md:mt-0 mt-10">
          {(isSuperAdmin || hasPermission('create_province')) && (
            <button
              onClick={() => setIsAddProvinceOpen(true)}
              className="bg-[#F5DEB3] text-[#1e1e1e] px-4 py-2 rounded-md font-medium hover:bg-[#f5deb3]/90 transition-colors"
            >
              Add Province
            </button>
          )}
        </div>
      </div>

      {/* Provinces Table */}
      <div className="bg-[#1E1E1E] rounded-lg border border-white/10 overflow-hidden mt-10">
        <div className="space-y-4 w-full overflow-x-auto scrollbar-hidden grid grid-cols-1">
          <table className='w-full overflow-x-auto'>
            <thead className="bg-[#2a2a2a] border-b border-white/10">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-white">Name</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-white">Description</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-white">Towns Count</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-white">Created</th>
                <th className="px-6 py-4 text-center text-sm font-medium text-white">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {provinces.length > 0 ? (
                provinces.map((province: Province) => (
                  <tr
                    key={province.id}
                    className="hover:bg-[#2a2a2a]/50 transition-colors cursor-pointer"
                    onClick={(e) => {
                      // Don't navigate if clicking on the Eye icon button
                      const target = e.target as HTMLElement;
                      if (target.closest('button')) {
                        return;
                      }
                      // Save current page to localStorage before navigating
                      if (typeof window !== 'undefined') {
                        localStorage.setItem(STORAGE_KEY_PROVINCES_PAGE, page.toString())
                      }
                      router.push(`/province/${province.id}`)
                    }}
                  >
                    <td className="px-6 py-4 text-sm text-white font-medium">
                      {province.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-300 max-w-xs truncate">
                      {province.description}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-300">
                      {province.towns?.length || 0}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-300">
                      {new Date(province.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          // Save current page to localStorage before navigating
                          if (typeof window !== 'undefined') {
                            localStorage.setItem(STORAGE_KEY_PROVINCES_PAGE, page.toString())
                          }
                          router.push(`/province/${province.id}`)
                        }}
                        className="inline-flex items-center justify-center p-2 cursor-pointer rounded-md transition-colors 
                        hover:bg-[#333] disabled:opacity-50 w-full"
                        title="View province"
                      >
                        <EyeIcon className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-400">
                    No provinces found. Create your first province to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="sm:gap-2 mt-6 w-full overflow-x-auto scrollbar-hidden mx-auto">
          <div className="flex flex-row items-center justify-center gap-1 sm:gap-2 max-w-[100px] mx-auto">
            <Button
              onClick={() => setPage(1)}
              disabled={pagination.page === 1}
              variant="outline"
              className="shrink-0 border-white/10 hover:bg-[#2a2a2a] text-gray-300 text-xs sm:text-sm px-2 sm:px-3 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              &lt;&lt;
            </Button>
            <Button
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={!pagination.hasPrev}
              variant="outline"
              className="shrink-0 border-white/10 hover:bg-[#2a2a2a] text-gray-300 text-xs sm:text-sm px-2 sm:px-3 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              &lt;
            </Button>
            {getPageNumbers(pagination.page, pagination.totalPages).map((pageNum, index) => (
              pageNum === '...' ? (
                <span key={`ellipsis-${index}`} className="text-gray-400 px-1 sm:px-2 text-xs sm:text-sm">
                  ...
                </span>
              ) : (
                <Button
                  key={pageNum}
                  onClick={() => setPage(pageNum as number)}
                  variant={pagination.page === pageNum ? "default" : "outline"}
                  className={`shrink-0 border-white/10 text-xs sm:text-sm px-2 sm:px-3 min-w-[32px] sm:min-w-[40px] ${pagination.page === pageNum
                      ? "bg-[#F5DEB3] text-[#1e1e1e] hover:bg-[#f5deb3]/90"
                      : "hover:bg-[#2a2a2a] text-gray-300"
                    }`}
                >
                  {pageNum}
                </Button>
              )
            ))}
            <Button
              onClick={() => setPage((prev) => prev + 1)}
              disabled={!pagination.hasNext}
              variant="outline"
              className="shrink-0 border-white/10 hover:bg-[#2a2a2a] text-gray-300 text-xs sm:text-sm px-2 sm:px-3 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              &gt;
            </Button>
            <Button
              onClick={() => setPage(pagination.totalPages)}
              disabled={pagination.page === pagination.totalPages}
              variant="outline"
              className="shrink-0 border-white/10 hover:bg-[#2a2a2a] text-gray-300 text-xs sm:text-sm px-2 sm:px-3 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              &gt;&gt;
            </Button>
          </div>

        </div>
      )}

      {/* Add Province Modal */}
      <Dialog open={isAddProvinceOpen} onOpenChange={setIsAddProvinceOpen}>
        <DialogContent className="text-white bg-[#1F1F27] p-6 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-white mb-4">
              Add New Province
            </DialogTitle>
          </DialogHeader>
          <AddProvince onSuccess={() => setIsAddProvinceOpen(false)} />
        </DialogContent>
      </Dialog>

    </div>
  )
}
