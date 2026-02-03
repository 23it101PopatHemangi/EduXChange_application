import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Upload, Eye, Download, TrendingUp } from 'lucide-react'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: resources } = await supabase
    .from('resources')
    .select('*')
    .eq('user_id', user?.id)
    .order('created_at', { ascending: false })

  const stats = [
    { name: 'Total Resources', value: resources?.length || 0, icon: Upload },
    { name: 'Total Views', value: 0, icon: Eye },
    { name: 'Downloads', value: 0, icon: Download },
    { name: 'This Month', value: '+12%', icon: TrendingUp },
  ]

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-foreground">Welcome back! 👋</h1>
          <p className="text-muted-foreground mt-2 text-lg">Here's your resource overview</p>
        </div>
        <Button asChild className="gap-2 bg-gradient-to-r from-primary to-primary/80 text-white hover:from-primary/90 hover:to-primary/70 h-11 px-6 shadow-lg">
          <Link href="/dashboard/upload">
            <Upload className="h-5 w-5" />
            Upload Resource
          </Link>
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.name} className="border-0 shadow-sm hover:shadow-md transition-all duration-200 bg-gradient-to-br from-background to-muted/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">{stat.name}</p>
                  <p className="text-3xl font-bold mt-3 text-foreground">{stat.value}</p>
                </div>
                <div className="p-3 rounded-xl bg-primary/10">
                  <stat.icon className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Resources Section */}
      <div>
        <div className="mb-6">
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Recent Resources</h2>
          <p className="text-muted-foreground mt-1">Your latest uploaded materials</p>
        </div>
        {resources && resources.length > 0 ? (
          <div className="space-y-4">
            {resources.slice(0, 5).map((resource) => (
              <Card key={resource.id} className="border-0 shadow-sm hover:shadow-md transition-all duration-200 bg-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-foreground">{resource.title || 'Untitled Resource'}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{resource.description || 'No description'}</p>
                      <div className="flex items-center gap-4 mt-3">
                        {resource.resource_type && (
                          <span className="text-xs font-medium text-muted-foreground">
                            📁 {resource.resource_type.toUpperCase()}
                          </span>
                        )}
                        {resource.is_public && (
                          <span className="text-xs font-medium text-muted-foreground">
                            🌐 Public
                          </span>
                        )}
                        <span className="text-xs text-muted-foreground">
                          {new Date(resource.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <Button asChild variant="ghost" className="text-primary hover:text-primary hover:bg-primary/10">
                      <Link href={`/dashboard/resources/${resource.id}`}>
                        View Details →
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="border-0 shadow-sm bg-muted/30 py-12">
            <CardContent className="text-center">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <Upload className="h-8 w-8 text-primary/50" />
                </div>
              </div>
              <p className="text-foreground font-semibold text-lg">No resources yet</p>
              <p className="text-sm text-muted-foreground mt-1">Start by uploading your first resource</p>
              <Button asChild className="mt-6">
                <Link href="/dashboard/upload">Upload Now</Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
        
      {resources && resources.length > 5 && (
        <Button asChild variant="outline" className="w-full mt-6 h-11">
          <Link href="/dashboard/resources">View All Resources ({resources.length}) →</Link>
        </Button>
      )}
    </div>
  )
}
