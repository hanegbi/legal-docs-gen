import * as React from "react"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface BentoCardProps {
  title: string
  description: string
  icon?: React.ReactNode
  className?: string
  onClick?: () => void
}

const BentoCard = React.forwardRef<HTMLDivElement, BentoCardProps>(
  ({ title, description, icon, className, onClick, ...props }, ref) => {
    return (
      <Card
        ref={ref}
        className={cn(
          "cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-lg",
          className
        )}
        onClick={onClick}
        {...props}
      >
        <CardHeader>
          <div className="flex items-center space-x-2">
            {icon && <div className="text-primary">{icon}</div>}
            <CardTitle className="text-lg">{title}</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <CardDescription>{description}</CardDescription>
        </CardContent>
      </Card>
    )
  }
)
BentoCard.displayName = "BentoCard"

interface BentoGridProps {
  children: React.ReactNode
  className?: string
}

const BentoGrid = React.forwardRef<HTMLDivElement, BentoGridProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "grid auto-rows-[200px] grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4",
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)
BentoGrid.displayName = "BentoGrid"

export { BentoGrid, BentoCard }
