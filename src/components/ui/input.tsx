import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        // Base style
        "w-full h-10 rounded-md px-3 text-sm outline-none",
        // Colors
        "bg-[#1E1E1E] text-white placeholder:text-white placeholder:opacity-90",
        // Border
        "border border-gray-400/70",
        // Subtle shadow
        "shadow-sm",
        // Focus state → keep subtle, no big ring
        "focus:border-gray-200 focus:ring-0",
        className
      )}
      {...props}
    />
  )
}

export { Input }
