import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { 
  FileText, 
  Video, 
  ImageIcon, 
  Link as LinkIcon, 
  StickyNote,
  Upload,
  TrendingUp,
  Eye,
  Download,
  Plus,
  ArrowRight,
} from 'lucide-react'
import type { Resource } from '@/lib/types'

const resourceTypeIcons = {
  pdf: FileText,
  notes: StickyNote,
  video: Video,
  image: ImageIcon,
  link: LinkIcon,
}

const resourceTypeColors = {
  pdf: 'bg-red-100 text-red-700',
  notes: 'bg-amber-100 text-amber-700',
  video: 'bg-blue-100 text-blue-700',
  image: 'bg-emerald-100 text-emerald-700',
  link: 'bg-violet-100 text-violet-700',
}

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Fetch user's resources
  const { data: resources } = await supabase
    .from('resources')
    .select('*')
    .eq('user_id', user?.id)
    .order('created_at', { ascending: false })
    .limit(5)

  // Fetch stats
  const { count: totalResources } = await supabase
    .from('resources')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user?.id)

  const { data: statsData } = await supabase
    .from('resources')
    .select('view_count, download_count')
    .eq('user_id', user?.id)

  const totalViews = statsData?.reduce((sum, r) => sum + (r.view_count || 0), 0) || 0
  const totalDownloads = statsData?.reduce((sum, r) => sum + (r.download_count || 0), 0) || 0

  const stats = [
    { name: 'Total Resources', value: totalResources || 0, icon: Upload, color: 'text-primary' },
    { name: 'Total Views', value: totalViews, icon: Eye, color: 'text-accent' },
    { name: 'Downloads', value: totalDownloads, icon: Download, color: 'text-emerald-600' },
    { name: 'This Month', value: '+12%', icon: TrendingUp, color: 'text-amber-600' },
  ]

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-balance">Welcome back!</h1>
          <p className="text-muted-foreground mt-1">
            {"Here's what's happening with your resources"}
          </p>
        </div>
        <Button asChild className="gap-2">
          <Link href="/dashboard/upload">
            <Plus className="h-4 w-4" />
            Upload Resource
          </Link>
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.name} className="border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.name}</p>
                  <p className="text-3xl font-bold mt-1">{stat.value}</p>
                </div>
                <div className={cn('p-3 rounded-xl bg-muted', stat.color)}>
                  <stat.icon className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Resources */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Recent Resources</CardTitle>
            <CardDescription>Your latest uploaded materials</CardDescription>
          </div>
          <Button asChild variant="ghost" size="sm" className="gap-1">
            <Link href="/dashboard/resources">
              View all
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          {resources && resources.length > 0 ? (
            <div className="space-y-4">
              {resources.map((resource: Resource) => {
                const Icon = resourceTypeIcons[resource.resource_type] || FileText
                const colorClass = resourceTypeColors[resource.resource_type] || resourceTypeColors.pdf
                return (
                  <Link
                    key={resource.id}
                    href={`/dashboard/resources/${resource.id}`}
                    className="flex items-center gap-4 p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
                  >
                    <div className={cn('p-3 rounded-lg', colorClass)}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{resource.title}</p>
                      <p className="text-sm text-muted-foreground truncate">
                        {resource.subject || resource.course_code || 'No subject'}
                      </p>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        {resource.view_count}
                      </span>
                      <span className="flex items-center gap-1">
                        <Download className="h-4 w-4" />
                        {resource.download_count}
                      </span>
                    </div>
                    <Badge variant="secondary" className="capitalize">
                      {resource.resource_type}
                    </Badge>
                  </Link>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                <Upload className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold">No resources yet</h3>
              <p className="text-muted-foreground mt-1 mb-4">
                Get started by uploading your first resource
              </p>
              <Button asChild>
                <Link href="/dashboard/upload">
                  <Plus className="h-4 w-4 mr-2" />
                  Upload Resource
                </Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="border-0 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
          <Link href="/dashboard/upload">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 rounded-xl bg-primary/10 text-primary">
                <FileText className="h-6 w-6" />
              </div>
              <div>
                <p className="font-semibold">Upload PDF</p>
                <p className="text-sm text-muted-foreground">Share lecture notes and documents</p>
              </div>
            </CardContent>
          </Link>
        </Card>
        <Card className="border-0 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
          <Link href="/dashboard/upload">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 rounded-xl bg-blue-100 text-blue-700">
                <Video className="h-6 w-6" />
              </div>
              <div>
                <p className="font-semibold">Add Video Link</p>
                <p className="text-sm text-muted-foreground">Share educational videos</p>
              </div>
            </CardContent>
          </Link>
        </Card>
        <Card className="border-0 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
          <Link href="/dashboard/upload">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 rounded-xl bg-amber-100 text-amber-700">
                <ImageIcon className="h-6 w-6" />
              </div>
              <div>
                <p className="font-semibold">Create Notes</p>
                <p className="text-sm text-muted-foreground">Write and share study notes</p>
              </div>
            </CardContent>
          </Link>
        </Card>
      </div>
    </div>
  )
}

function cn(...classes: (string | undefined)[]) {
  return classes.filter(Boolean).join(' ')
}
