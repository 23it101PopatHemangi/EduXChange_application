import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertCircle } from 'lucide-react'

export default function AuthErrorPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted/20 to-background p-4 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-96 h-96 rounded-full bg-destructive/5 -top-48 -left-48 blur-3xl" />
        <div className="absolute w-96 h-96 rounded-full bg-primary/5 -bottom-48 -right-48 blur-3xl" />
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
            <div className="mx-auto w-16 h-16 bg-destructive/20 rounded-full flex items-center justify-center">
              <AlertCircle className="w-8 h-8 text-destructive" />
            </div>
            <CardTitle className="text-2xl font-bold text-balance">Authentication Error</CardTitle>
            <CardDescription className="text-base">
              Something went wrong during authentication. Please try again.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              If this problem persists, please contact support.
            </p>
          </CardContent>
          <CardFooter className="flex flex-col gap-3">
            <Button asChild className="w-full h-11 font-semibold bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg">
              <Link href="/auth/login">Try Again</Link>
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
