import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { BookOpen, Mail, CheckCircle2 } from 'lucide-react'

export default function SignUpSuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-secondary/30 to-background p-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <Link href="/" className="flex items-center gap-2 text-primary">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold text-foreground">EduXchange</span>
          </Link>
        </div>

        <Card className="border-0 shadow-xl shadow-primary/5 text-center">
          <CardHeader className="space-y-4 pb-6">
            <div className="mx-auto w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8 text-accent" />
            </div>
            <CardTitle className="text-2xl font-bold text-balance">Check your email</CardTitle>
            <CardDescription className="text-base">
              {"We've sent you a confirmation link to verify your account"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-center gap-3 p-4 bg-muted rounded-lg">
              <Mail className="w-5 h-5 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                Click the link in your email to activate your account
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-3">
            <Button asChild className="w-full h-11 font-semibold">
              <Link href="/auth/login">Go to Sign In</Link>
            </Button>
            <Button asChild variant="ghost" className="w-full">
              <Link href="/">Back to Home</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
