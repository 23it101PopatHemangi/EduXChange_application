import { createClient } from '@/lib/supabase/server'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import {
  FileText,
  Video,
  ImageIcon,
  Link as LinkIcon,
  StickyNote,
  Plus,
  Eye,
  Download,
  FolderOpen,
  MoreHorizontal,
  Pencil,
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { Resource } from '@/lib/types'
import { DeleteResourceButton } from '@/components/dashboard/delete-resource-button'

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

export default async function ResourcesPage({ searchParams }: { searchParams: { type?: string } }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let query = supabase
    .from('resources')
    .select('*')
    .eq('user_id', user?.id)
    .order('created_at', { ascending: false })

  if (searchParams.type) {
    query = query.eq('resource_type', searchParams.type)
  }

  const { data: resources } = await query

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return null
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">My Resources</h1>
          <p className="text-muted-foreground mt-1">
            Manage all your uploaded academic materials
          </p>
        </div>
        <Button asChild className="gap-2 bg-gradient-to-r from-primary to-primary/80 text-white hover:from-primary/90 hover:to-primary/70 h-11 px-5 shadow-lg">
          <Link href="/dashboard/upload">
            <Plus className="h-4 w-4" />
            Upload Resource
          </Link>
        </Button>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        <Link href="/dashboard/resources">
          <Badge 
            variant={!searchParams.type ? 'default' : 'secondary'} 
            className="cursor-pointer px-4 py-2 rounded-full"
          >
            All
          </Badge>
        </Link>
        {Object.entries(resourceTypeIcons).map(([type, Icon]) => (
          <Link key={type} href={`/dashboard/resources?type=${type}`}>
            <Badge 
              variant={searchParams.type === type ? 'default' : 'secondary'} 
              className="cursor-pointer px-4 py-2 rounded-full gap-1.5 capitalize"
            >
              <Icon className="h-3.5 w-3.5" />
              {type}s
            </Badge>
          </Link>
        ))}
      </div>

      {/* Resources Grid */}
      {resources && resources.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {resources.map((resource: Resource) => {
            const Icon = resourceTypeIcons[resource.resource_type] || FileText
            const colorClass = resourceTypeColors[resource.resource_type] || resourceTypeColors.pdf

            return (
              <Card key={resource.id} className="border-0 shadow-sm hover:shadow-md transition-all duration-200 group bg-gradient-to-br from-background to-muted/30">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className={`p-3 rounded-lg shrink-0 ${colorClass}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/dashboard/resources/${resource.id}`}>
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/dashboard/resources/${resource.id}/edit`}>
                            <Pencil className="h-4 w-4 mr-2" />
                            Edit
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                          <DeleteResourceButton resourceId={resource.id} resourceTitle={resource.title || 'Untitled Resource'} />
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <div className="mt-4">
                    <h2 className="text-lg font-semibold text-foreground">
                      {resource.title || 'No title available'}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      {resource.description || 'No description available'}
                    </p>
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center gap-2">
                        {resource.file_url && (
                          <Button asChild size="sm" variant="secondary" className="gap-2">
                            <Link href={resource.file_url} target="_blank">
                              <Eye className="h-4 w-4" />
                              View
                            </Link>
                          </Button>
                        )}
                        {resource.file_url && (
                          <Button asChild size="sm" variant="outline" className="gap-2">
                            <Link href={resource.file_url} download>
                              <Download className="h-4 w-4" />
                              Download
                            </Link>
                          </Button>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground text-right">
                        <div>{formatFileSize(resource.file_size)}</div>
                        <div>{formatDate(resource.created_at)}</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      ) : (
        <Card className="border-0 shadow-sm bg-muted/30">
          <CardContent className="py-12 text-center">
            <div className="mx-auto w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <FolderOpen className="h-7 w-7 text-primary/60" />
            </div>
            <p className="text-foreground font-semibold">No resources found</p>
            <p className="text-sm text-muted-foreground mt-1">Upload your first resource to get started</p>
            <Button asChild className="mt-5">
              <Link href="/dashboard/upload">Upload Resource</Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
