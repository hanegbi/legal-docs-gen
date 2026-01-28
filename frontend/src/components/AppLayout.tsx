import * as React from "react"
import { Outlet, Link, useLocation } from "react-router-dom"
import { FileText, Users, Home, FileCheck } from "lucide-react"
import { cn } from "@/lib/utils"
import { GradientText } from "@/components/magic/gradient-text"

const AppLayout = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    const location = useLocation()
    
    const navigation = [
      { name: "Dashboard", href: "/dashboard", icon: Home },
      { name: "Profiles", href: "/profiles", icon: Users },
      { name: "Documents", href: "/documents", icon: FileCheck },
    ]

    return (
      <div ref={ref} className={cn("min-h-screen bg-background", className)} {...props}>
        {/* Header */}
        <header className="border-b border-border bg-card">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <FileText className="h-8 w-8 text-primary" />
                <GradientText className="text-2xl">Legal Docs Gen</GradientText>
              </div>
              
              <nav className="flex items-center space-x-6">
                {navigation.map((item) => {
                  const Icon = item.icon
                  const isActive = location.pathname === item.href || 
                    (item.href === "/dashboard" && location.pathname === "/")
                  
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={cn(
                        "flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                        isActive
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:text-foreground hover:bg-accent"
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{item.name}</span>
                    </Link>
                  )
                })}
              </nav>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-6">
          <Outlet />
        </main>

        {/* Footer */}
        <footer className="border-t border-border bg-card mt-auto">
          <div className="container mx-auto px-4 py-4">
            <p className="text-center text-sm text-muted-foreground">
              ⚠️ This tool generates legal document templates. This is not legal advice. 
              Please consult with a qualified attorney for your specific legal needs.
            </p>
          </div>
        </footer>
      </div>
    )
  }
)
AppLayout.displayName = "AppLayout"

export { AppLayout }
