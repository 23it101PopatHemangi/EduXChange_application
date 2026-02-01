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
  Calendar,
  FolderOpen,
  MoreHorizontal,
  Pencil,
  Trash2,
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

interface ResourcesPageProps {
  searchParams: Promise<{ type?: string }>
}

export default async function ResourcesPage({ searchParams }: ResourcesPageProps) {
  const params = await searchParams
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let query = supabase
    .from('resources')
    .select('*')
    .eq('user_id', user?.id)
    .order('created_at', { ascending: false })

  if (params.type) {
    query = query.eq('resource_type', params.type)
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
          <h1 className="text-3xl font-bold tracking-tight">My Resources</h1>
          <p className="text-muted-foreground mt-1">
            Manage all your uploaded academic materials
          </p>
        </div>
        <Button asChild className="gap-2">
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
            variant={!params.type ? 'default' : 'secondary'} 
            className="cursor-pointer px-4 py-2"
          >
            All
          </Badge>
        </Link>
        {Object.entries(resourceTypeIcons).map(([type, Icon]) => (
          <Link key={type} href={`/dashboard/resources?type=${type}`}>
            <Badge 
              variant={params.type === type ? 'default' : 'secondary'} 
              className="cursor-pointer px-4 py-2 gap-1.5 capitalize"
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
              <Card key={resource.id} className="border-0 shadow-sm hover:shadow-md transition-shadow group">
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
                        <DeleteResourceButton resourceId={resource.id} resourceTitle={resource.title} />
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <Link href={`/dashboard/resources/${resource.id}`} className="block mt-4">
                    <h3 className="font-semibold text-lg leading-tight line-clamp-2 hover:text-primary transition-colors">
                      {resource.title}
                    </h3>
                    {resource.description && (
                      <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                        {resource.description}
                      </p>
                    )}
                  </Link>

                  <div className="flex flex-wrap gap-1.5 mt-4">
                    {resource.subject && (
                      <Badge variant="outline" className="text-xs">
                        {resource.subject}
                      </Badge>
                    )}
                    {resource.course_code && (
                      <Badge variant="outline" className="text-xs">
                        {resource.course_code}
                      </Badge>
                    )}
                    {!resource.is_public && (
                      <Badge variant="secondary" className="text-xs">
                        Private
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-border text-sm text-muted-foreground">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <Eye className="h-3.5 w-3.5" />
                        {resource.view_count}
                      </span>
                      <span className="flex items-center gap-1">
                        <Download className="h-3.5 w-3.5" />
                        {resource.download_count}
                      </span>
                    </div>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      {formatDate(resource.created_at)}
                    </span>
                  </div>

                  {resource.file_size && (
                    <p className="text-xs text-muted-foreground mt-2">
                      {formatFileSize(resource.file_size)}
                    </p>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      ) : (
        <Card className="border-0 shadow-sm">
          <CardContent className="py-16 text-center">
            <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
              <FolderOpen className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold">No resources found</h3>
            <p className="text-muted-foreground mt-1 mb-4">
              {params.type 
                ? `You haven't uploaded any ${params.type}s yet`
                : "Get started by uploading your first resource"
              }
            </p>
            <Button asChild>
              <Link href="/dashboard/upload">
                <Plus className="h-4 w-4 mr-2" />
                Upload Resource
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
