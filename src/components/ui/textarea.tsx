import * as React from "react"
import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        // Base style (match input)
        "w-full rounded-md px-3 text-sm outline-none",
        // Height — larger for textarea
        "min-h-[100px]",
        // Colors (match input)
        "bg-[#1E1E1E] text-white placeholder:text-gray-400",
        // Border (match input)
        "border border-gray-400/70",
        // Subtle shadow
        "shadow-sm",
        // Focus state → keep subtle
        "focus:border-gray-200 focus:ring-0",
        // Disabled state
        "disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
