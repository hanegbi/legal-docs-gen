import * as React from "react"
import { cn } from "@/lib/utils"

interface GradientTextProps extends React.HTMLAttributes<HTMLHeadingElement> {
  children: React.ReactNode
}

const GradientText = React.forwardRef<HTMLHeadingElement, GradientTextProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <h1
        ref={ref}
        className={cn(
          "bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent font-bold",
          className
        )}
        {...props}
      >
        {children}
      </h1>
    )
  }
)
GradientText.displayName = "GradientText"

export { GradientText }
