import * as React from "react"
import { FileText, Calendar, Eye } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { BackgroundBeams } from "@/components/magic/background-beams"

const DocumentsList = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    // Mock data - in real app this would come from API
    const documents = [
      {
        id: "1",
        type: "Terms of Service",
        title: "Terms of Service - Test Company Inc.",
        company: "Test Company Inc.",
        createdAt: "2024-01-15",
        version: 1
      },
      {
        id: "2", 
        type: "Privacy Policy",
        title: "Privacy Policy - Test Company Inc.",
        company: "Test Company Inc.",
        createdAt: "2024-01-14",
        version: 1
      }
    ]

    return (
      <div ref={ref} className={className} {...props}>
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Documents</h1>
          <p className="text-muted-foreground">
            View and manage all your generated legal documents
          </p>
        </div>

        {documents.length > 0 ? (
          <div className="space-y-4">
            {documents.map((doc) => (
              <Card key={doc.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <FileText className="h-5 w-5 text-primary" />
                      <div>
                        <CardTitle className="text-lg">{doc.title}</CardTitle>
                        <CardDescription>{doc.company}</CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={doc.type === "Terms of Service" ? "default" : "secondary"}>
                        {doc.type}
                      </Badge>
                      <Badge variant="outline">v{doc.version}</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>{doc.createdAt}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </Button>
                      <Button variant="outline" size="sm">
                        Copy
                      </Button>
                      <Button variant="outline" size="sm">
                        Download
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <BackgroundBeams className="rounded-lg">
            <Card className="bg-transparent border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No documents yet</h3>
                <p className="text-muted-foreground text-center mb-4">
                  Generate your first legal document to get started
                </p>
                <Button>Generate Document</Button>
              </CardContent>
            </Card>
          </BackgroundBeams>
        )}
      </div>
    )
  }
)
DocumentsList.displayName = "DocumentsList"

export { DocumentsList }
