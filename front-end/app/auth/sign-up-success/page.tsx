import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Mail } from "lucide-react"

export default function SignUpSuccessPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f0f4f8]">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-lg">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
          <Mail className="h-8 w-8 text-primary" />
        </div>
        
        <h1 className="text-2xl font-bold text-foreground">Check your email</h1>
        <p className="mt-3 text-muted-foreground">
          {"We've sent you a confirmation link. Please check your email to verify your account."}
        </p>

        <Button asChild className="mt-6 w-full">
          <Link href="/auth/login">Back to Sign In</Link>
        </Button>
      </div>
    </div>
  )
}
