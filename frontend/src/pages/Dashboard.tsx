import * as React from "react"
import { Link } from "react-router-dom"
import { Plus, FileText, Shield } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BentoGrid, BentoCard } from "@/components/magic/bento-grid"
import { BackgroundBeams } from "@/components/magic/background-beams"
import { GradientText } from "@/components/magic/gradient-text"

const Dashboard = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={className} {...props}>
        <div className="mb-8">
          <GradientText className="text-4xl mb-2">Welcome back!</GradientText>
          <p className="text-muted-foreground text-lg">
            Ready to generate your legal documents? Choose what you'd like to create.
          </p>
        </div>

        <div className="mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Company Profile</CardTitle>
              <CardDescription>
                Your company information is ready for document generation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Test Company Inc.</p>
                  <p className="text-sm text-muted-foreground">US, EU • Privacy Policy Ready</p>
                </div>
                <Button variant="outline" size="sm">
                  Edit Profile
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Quick Actions</h2>
          <BentoGrid>
            <BentoCard
              title="Generate Terms of Service"
              description="Create comprehensive terms of service for your platform"
              icon={<FileText className="h-6 w-6" />}
              onClick={() => {/* Navigate to generator */}}
            />
            <BentoCard
              title="Generate Privacy Policy"
              description="Build a compliant privacy policy for your service"
              icon={<Shield className="h-6 w-6" />}
              onClick={() => {/* Navigate to generator */}}
            />
            <BentoCard
              title="Create New Profile"
              description="Set up a new company profile for document generation"
              icon={<Plus className="h-6 w-6" />}
              onClick={() => {/* Navigate to profile creation */}}
            />
          </BentoGrid>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-4">Recent Documents</h2>
          <BackgroundBeams className="rounded-lg">
            <Card className="bg-transparent border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No documents yet</h3>
                <p className="text-muted-foreground text-center mb-4">
                  Generate your first legal document to get started
                </p>
                <Button asChild>
                  <Link to="/profiles/new">Create Profile</Link>
                </Button>
              </CardContent>
            </Card>
          </BackgroundBeams>
        </div>
      </div>
    )
  }
)
Dashboard.displayName = "Dashboard"

export { Dashboard }
