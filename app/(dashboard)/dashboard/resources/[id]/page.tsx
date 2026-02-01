import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import type { Resource } from '@/lib/types'
import { 
  FileText, 
  Video, 
  ImageIcon, 
  Link as LinkIcon, 
  StickyNote,
  Eye,
  Download,
  Calendar,
  ArrowLeft,
  Pencil,
  ExternalLink,
  Clock,
  Tag,
  User,
  BookOpen,
  Globe,
  Lock,
} from 'lucide-react'

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

interface ResourceDetailPageProps {
  params: Promise<{ id: string }>
}

export default async function ResourceDetailPage({ params }: ResourceDetailPageProps) {
  const { id } = await params
  const supabase = await createClient()

  const { data: resource, error } = await supabase
    .from('resources')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !resource) {
    notFound()
  }

  // Increment view count
  await supabase
    .from('resources')
    .update({ view_count: (resource.view_count || 0) + 1 })
    .eq('id', id)

  const Icon = resourceTypeIcons[resource.resource_type as keyof typeof resourceTypeIcons] || FileText
  const colorClass = resourceTypeColors[resource.resource_type as keyof typeof resourceTypeColors] || resourceTypeColors.pdf

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
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
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Back Button */}
      <Button asChild variant="ghost" className="gap-2 -ml-2">
        <Link href="/dashboard/resources">
          <ArrowLeft className="h-4 w-4" />
          Back to Resources
        </Link>
      </Button>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className={`p-4 rounded-xl ${colorClass}`}>
            <Icon className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-balance">{resource.title}</h1>
            <div className="flex flex-wrap items-center gap-3 mt-2 text-muted-foreground">
              <Badge variant="secondary" className="capitalize">
                {resource.resource_type}
              </Badge>
              {resource.is_public ? (
                <span className="flex items-center gap-1 text-sm">
                  <Globe className="h-3.5 w-3.5" />
                  Public
                </span>
              ) : (
                <span className="flex items-center gap-1 text-sm">
                  <Lock className="h-3.5 w-3.5" />
                  Private
                </span>
              )}
            </div>
          </div>
        </div>
        <Button asChild className="gap-2">
          <Link href={`/dashboard/resources/${id}/edit`}>
            <Pencil className="h-4 w-4" />
            Edit Resource
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Description */}
          {resource.description && (
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                  {resource.description}
                </p>
              </CardContent>
            </Card>
          )}

          {/* File/Link Preview */}
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Resource</CardTitle>
            </CardHeader>
            <CardContent>
              {resource.file_url ? (
                <div className="space-y-4">
                  {resource.resource_type === 'pdf' && (
                    <div className="aspect-[4/3] bg-muted rounded-lg overflow-hidden">
                      <iframe
                        src={resource.file_url}
                        className="w-full h-full"
                        title={resource.title}
                      />
                    </div>
                  )}
                  {resource.resource_type === 'image' && (
                    <div className="rounded-lg overflow-hidden">
                      <img
                        src={resource.file_url || "/placeholder.svg"}
                        alt={resource.title}
                        className="w-full h-auto"
                      />
                    </div>
                  )}
                  <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{resource.file_name}</p>
                        {resource.file_size && (
                          <p className="text-sm text-muted-foreground">
                            {formatFileSize(resource.file_size)}
                          </p>
                        )}
                      </div>
                    </div>
                    <Button asChild>
                      <a href={resource.file_url} download target="_blank" rel="noopener noreferrer">
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </a>
                    </Button>
                  </div>
                </div>
              ) : resource.external_link ? (
                <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                  <div className="flex items-center gap-3 min-w-0">
                    <LinkIcon className="h-5 w-5 text-muted-foreground shrink-0" />
                    <p className="text-sm truncate">{resource.external_link}</p>
                  </div>
                  <Button asChild>
                    <a href={resource.external_link} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Open Link
                    </a>
                  </Button>
                </div>
              ) : (
                <p className="text-muted-foreground">No file or link available</p>
              )}
            </CardContent>
          </Card>

          {/* Tags */}
          {resource.tags && resource.tags.length > 0 && (
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Tag className="h-5 w-5" />
                  Tags
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {resource.tags.map((tag: string) => (
                    <Badge key={tag} variant="secondary" className="px-3 py-1">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Stats */}
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-muted-foreground">
                  <Eye className="h-4 w-4" />
                  Views
                </span>
                <span className="font-semibold">{resource.view_count}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-muted-foreground">
                  <Download className="h-4 w-4" />
                  Downloads
                </span>
                <span className="font-semibold">{resource.download_count}</span>
              </div>
            </CardContent>
          </Card>

          {/* Details */}
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {resource.subject && (
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-muted-foreground">
                    <BookOpen className="h-4 w-4" />
                    Subject
                  </span>
                  <span className="font-medium">{resource.subject}</span>
                </div>
              )}
              {resource.course_code && (
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-muted-foreground">
                    <Tag className="h-4 w-4" />
                    Course Code
                  </span>
                  <span className="font-medium">{resource.course_code}</span>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  Created
                </span>
                <span className="font-medium text-sm">{formatDate(resource.created_at)}</span>
              </div>
              {resource.updated_at !== resource.created_at && (
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    Updated
                  </span>
                  <span className="font-medium text-sm">{formatDate(resource.updated_at)}</span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
