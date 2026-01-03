import {  CheckCircle2Icon } from "lucide-react"

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"

export function AlertDemo() {
  return (
    <div className="grid w-full  max-w-xl items-start gap-4">
      <Alert>
        <CheckCircle2Icon className="text-green-600" />
        <AlertTitle className="text-green-600">Success! Your changes have been saved</AlertTitle>
        <AlertDescription className="text-green-600">
          This is an alert with icon, title and description.
        </AlertDescription>
    
      </Alert>
    </div>
  )
}
