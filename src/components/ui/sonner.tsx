"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner, ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "dark" } = useTheme()

  return (
    <Sonner
      theme="dark"
      className="toaster group"
      toastOptions={{
        style: {
          background: '#1E1E1E',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          color: '#ffffff',
        },
        classNames: {
          toast: 'bg-[#1E1E1E] border border-white/10 text-white',
          title: 'text-white font-medium',
          description: 'text-gray-300',
          actionButton: 'bg-[#F5DEB3] text-[#1e1e1e] hover:bg-[#f5deb3]/90',
          cancelButton: 'bg-[#2a2a2a] text-white hover:bg-[#3a3a3a]',
          closeButton: 'text-gray-400 hover:text-white',
          success: 'bg-[#1E1E1E] border-green-500/20',
          error: 'bg-[#1E1E1E] border-red-500/20',
          warning: 'bg-[#1E1E1E] border-yellow-500/20',
          info: 'bg-[#1E1E1E] border-blue-500/20',
        },
      }}
      style={
        {
          "--normal-bg": "#1E1E1E",
          "--normal-text": "#ffffff",
          "--normal-border": "rgba(255, 255, 255, 0.1)",
          "--success-bg": "#1E1E1E",
          "--success-text": "#ffffff",
          "--success-border": "rgba(34, 197, 94, 0.2)",
          "--error-bg": "#1E1E1E",
          "--error-text": "#ffffff",
          "--error-border": "rgba(239, 68, 68, 0.2)",
          "--warning-bg": "#1E1E1E",
          "--warning-text": "#ffffff",
          "--warning-border": "rgba(245, 158, 11, 0.2)",
          "--info-bg": "#1E1E1E",
          "--info-text": "#ffffff",
          "--info-border": "rgba(59, 130, 246, 0.2)",
        } as React.CSSProperties
      }
      {...props}
    />
  )
}

export { Toaster }
