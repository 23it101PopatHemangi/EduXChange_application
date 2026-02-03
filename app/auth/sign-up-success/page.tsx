import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Mail, CheckCircle2 } from 'lucide-react'

export default function SignUpSuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted/20 to-background p-4 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-96 h-96 rounded-full bg-primary/5 -top-48 -left-48 blur-3xl" />
        <div className="absolute w-96 h-96 rounded-full bg-accent/10 -bottom-48 -right-48 blur-3xl" />
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">EX</span>
            </div>
            <div>
              <p className="font-bold text-2xl text-foreground">EduXchange</p>
              <p className="text-xs text-muted-foreground">Learning Platform</p>
            </div>
          </div>
        </div>

        <Card className="border-0 shadow-xl shadow-primary/10 text-center">
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
            <Button asChild className="w-full h-11 font-semibold bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg">
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
