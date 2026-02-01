import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  BookOpen,
  Upload,
  Users,
  Search,
  FileText,
  Video,
  ImageIcon,
  StickyNote,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Shield,
  Zap,
  Globe,
  GraduationCap,
} from 'lucide-react'

const features = [
  {
    icon: Upload,
    title: 'Easy Upload',
    description: 'Upload PDFs, notes, videos, and more with just a few clicks. Share your knowledge effortlessly.',
  },
  {
    icon: Search,
    title: 'Smart Discovery',
    description: 'Find exactly what you need with powerful search and filtering by subject, course, and type.',
  },
  {
    icon: Users,
    title: 'Community Driven',
    description: 'Join a thriving community of students sharing and learning from each other.',
  },
  {
    icon: Shield,
    title: 'Secure & Private',
    description: 'Your data is protected with industry-standard security. Share publicly or keep it private.',
  },
]

const resourceTypes = [
  { icon: FileText, label: 'PDFs', color: 'bg-red-100 text-red-700' },
  { icon: StickyNote, label: 'Notes', color: 'bg-amber-100 text-amber-700' },
  { icon: Video, label: 'Videos', color: 'bg-blue-100 text-blue-700' },
  { icon: ImageIcon, label: 'Images', color: 'bg-emerald-100 text-emerald-700' },
]

const stats = [
  { value: '10K+', label: 'Resources Shared' },
  { value: '5K+', label: 'Active Students' },
  { value: '500+', label: 'Universities' },
  { value: '99%', label: 'Satisfaction' },
]

const benefits = [
  'Access study materials anytime, anywhere',
  'Collaborate with peers from your university',
  'Track views and downloads on your uploads',
  'Organize resources by subject and course',
  'Build your academic portfolio',
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <nav className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">EduXchange</span>
          </Link>
          <div className="flex items-center gap-3">
            <Button asChild variant="ghost">
              <Link href="/auth/login">Sign in</Link>
            </Button>
            <Button asChild>
              <Link href="/auth/sign-up">Get Started</Link>
            </Button>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
        <div className="container mx-auto px-4 py-24 lg:py-32 relative">
          <div className="max-w-3xl mx-auto text-center">
            <Badge variant="secondary" className="mb-6 px-4 py-1.5">
              <Sparkles className="w-3.5 h-3.5 mr-1.5" />
              The #1 Academic Resource Platform
            </Badge>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-balance">
              Share Knowledge,{' '}
              <span className="text-primary">Empower Learning</span>
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto text-pretty">
              EduXchange connects students to share academic resources, study materials, and insights. Upload your notes, discover new content, and excel together.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button asChild size="lg" className="gap-2 h-12 px-8 text-base">
                <Link href="/auth/sign-up">
                  Start Sharing Free
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="gap-2 h-12 px-8 text-base bg-transparent">
                <Link href="/auth/login">
                  Sign in to Dashboard
                </Link>
              </Button>
            </div>
          </div>

          {/* Resource Type Pills */}
          <div className="mt-16 flex flex-wrap justify-center gap-3">
            {resourceTypes.map((type) => (
              <div
                key={type.label}
                className={`flex items-center gap-2 px-4 py-2 rounded-full ${type.color}`}
              >
                <type.icon className="w-4 h-4" />
                <span className="font-medium text-sm">{type.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-y border-border bg-muted/30">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl sm:text-4xl font-bold text-primary">{stat.value}</p>
                <p className="mt-1 text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-24">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <Badge variant="secondary" className="mb-4">Features</Badge>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-balance">
            Everything you need to succeed
          </h2>
          <p className="mt-4 text-lg text-muted-foreground text-pretty">
            Powerful tools designed to help students share, discover, and organize academic resources efficiently.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <Card key={feature.title} className="border-0 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-muted/30 border-y border-border">
        <div className="container mx-auto px-4 py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge variant="secondary" className="mb-4">Why EduXchange</Badge>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-balance">
                Built for students, by students
              </h2>
              <p className="mt-4 text-lg text-muted-foreground text-pretty">
                We understand the challenges of academic life. EduXchange makes it easy to share resources and help each other succeed.
              </p>
              <ul className="mt-8 space-y-4">
                {benefits.map((benefit) => (
                  <li key={benefit} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                    <span className="text-foreground">{benefit}</span>
                  </li>
                ))}
              </ul>
              <Button asChild className="mt-8 gap-2">
                <Link href="/auth/sign-up">
                  Join Now
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Card className="border-0 shadow-sm p-6 text-center">
                <Zap className="w-10 h-10 text-primary mx-auto mb-3" />
                <p className="font-semibold">Lightning Fast</p>
                <p className="text-sm text-muted-foreground mt-1">Upload and access resources instantly</p>
              </Card>
              <Card className="border-0 shadow-sm p-6 text-center mt-8">
                <Globe className="w-10 h-10 text-accent mx-auto mb-3" />
                <p className="font-semibold">Global Community</p>
                <p className="text-sm text-muted-foreground mt-1">Connect with students worldwide</p>
              </Card>
              <Card className="border-0 shadow-sm p-6 text-center">
                <GraduationCap className="w-10 h-10 text-primary mx-auto mb-3" />
                <p className="font-semibold">Academic Focus</p>
                <p className="text-sm text-muted-foreground mt-1">Designed for learning materials</p>
              </Card>
              <Card className="border-0 shadow-sm p-6 text-center mt-8">
                <Shield className="w-10 h-10 text-accent mx-auto mb-3" />
                <p className="font-semibold">Privacy First</p>
                <p className="text-sm text-muted-foreground mt-1">Control who sees your content</p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-24">
        <Card className="border-0 shadow-lg bg-gradient-to-br from-primary to-primary/80 text-primary-foreground overflow-hidden relative">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyIi8+PC9nPjwvZz48L3N2Zz4=')] opacity-50" />
          <CardContent className="p-8 sm:p-12 lg:p-16 text-center relative">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-balance">
              Ready to transform your academic journey?
            </h2>
            <p className="mt-4 text-lg text-primary-foreground/80 max-w-2xl mx-auto text-pretty">
              Join thousands of students already sharing and discovering resources on EduXchange. It&apos;s free to get started.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button asChild size="lg" variant="secondary" className="gap-2 h-12 px-8 text-base">
                <Link href="/auth/sign-up">
                  Create Free Account
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t border-border">
        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <BookOpen className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-semibold">EduXchange</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Made with care for students everywhere.
            </p>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <Link href="#" className="hover:text-foreground transition-colors">Privacy</Link>
              <Link href="#" className="hover:text-foreground transition-colors">Terms</Link>
              <Link href="#" className="hover:text-foreground transition-colors">Contact</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
