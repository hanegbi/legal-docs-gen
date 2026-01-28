import * as React from "react"
import { cn } from "@/lib/utils"

interface BackgroundBeamsProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

const BackgroundBeams = React.forwardRef<HTMLDivElement, BackgroundBeamsProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("relative overflow-hidden", className)}
        {...props}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-purple-500/5">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-primary/10 to-transparent animate-beam-1" />
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-purple-500/10 to-transparent animate-beam-2" />
        </div>
        <div className="relative z-10">{children}</div>
      </div>
    )
  }
)
BackgroundBeams.displayName = "BackgroundBeams"

export { BackgroundBeams }
